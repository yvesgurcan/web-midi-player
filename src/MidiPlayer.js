import {
    MIDI_AUDIO_BUFFER_SIZE,
    MIDI_DEFAULT_PATCH_URL,
    MIDI_AUDIO_S16LSB,
    MAX_I16
} from './constants';

import {
    MIDI_ERROR,
    MIDI_LOAD_FILE,
    MIDI_LOAD_PATCH,
    MIDI_PLAY,
    MIDI_PAUSE,
    MIDI_RESUME,
    MIDI_STOP,
    MIDI_END
} from './events';

import LibTiMidity from './LibTiMidity';
import EventHandler from './EventHandler';

export default class MidiPlayer {
    /**
     * @class MidiPlayer
     * @param {object} [configuration]
     * @param {function} [configuration.eventLogger = undefined] The function that receives event payloads.
     * @param {boolean} [configuration.logging = false] Turns ON or OFF logging to the console.
     * @param {string} [configuration.patchUrl = /public/midi/pat/] The public path where MIDI instrument patches can be found.
     * @param {object} [configuration.audioContext] An instance of the Web Audio API AudioContext interface.
     * @property {object} context The AudioContext instance.
     * @property {function} eventLogger The function that is called to emit events.
     * @property {boolean} logging Whether console logging is ON or OFF.
     * @property {arrayBuffer} midiFileArray A typed array that represents the content of the MIDI.
     * @property {*} midiFileBuffer The buffer with the MIDI data.
     * @property {number} missingPatchCount The number of MIDI instrument patches that need to be loaded before playing the MIDI.
     * @property {string} patchUrl The URL used to load MIDI instrument patches.
     * @property {object} source The source that plays the audio signal.
     * @property {number} startTime The time when MIDI playback started.
     * @property {number} stream The MIDI stream.
     * @property {*} waveBuffer The buffer with the MIDI data converted to WAV.
     *
     * @return {object} A `MidiPlayer` instance.
     * @example
     * import MidiPlayer from 'web-midi-player';
     *
     * const eventLogger = (payload) => {
     *   console.log('Received event:', payload.event)
     * }
     *
     * const midiPlayer = new MidiPlayer({ eventLogger, logging: true, patchUrl: '/patches/' });
     */
    constructor({
        eventLogger = undefined,
        logging = false,
        patchUrl = MIDI_DEFAULT_PATCH_URL,
        audioContext
    } = {}) {
        this.eventHandler = new EventHandler({ eventLogger, logging });

        try {
            this.eventLogger = eventLogger;
            this.logging = logging;
            this.patchUrl = patchUrl;
            this.context = audioContext || new AudioContext();
            this.startTime = 0;
            this.eventHandler.emitInit();
        } catch (error) {
            this.emitEvent({
                event: MIDI_ERROR,
                message: 'Could not initialize AudioContext.'
            });
        }
    }

    /**
     * Starts playback of MIDI input.
     *
     * Please note that you can not use `input.arrayBuffer` and `input.url` concurrently.
     * @param {object} input
     * @param {arrayBuffer} [input.arrayBuffer] An array buffer containing MIDI data.
     * @param {string} [input.url] The URL where the MIDI file is located.
     * @param {string} [input.name] A human-friendly name for the song.
     * @param {object} [input.audioContext] An instance of the Web Audio API AudioContext interface.
     * @return {boolean} Whether playback was successfully initiated or not.
     * @example
     * const name1 = 'My MIDI file from URL';
     * const url = 'media/file.midi';
     * midiPlayer.play({ url, name: name1 });
     *
     * const name2 = 'My MIDI file from ArrayBuffer';
     * const arrayBuffer = new ArrayBuffer();
     * midiPlayer.play({ arrayBuffer , name: name2 });
     */
    play({ arrayBuffer, url, name, audioContext } = {}) {
        this.stop();

        if (url) {
            this.fetchRemoteUrl({ url, name, audioContext });
        } else if (arrayBuffer) {
            this.emitEvent({
                event: MIDI_LOAD_FILE,
                message: `Loading '${name}'...`
            });
            this.loadSong({ arrayBuffer, audioContext });
        } else {
            this.emitEvent({
                event: MIDI_ERROR,
                message: 'Unknown source. Must pass either url or arrayBuffer.'
            });
            return false;
        }

        return true;
    }

    formatMidiName(name) {
        return name ? ` '${name}'` : '';
    }

    async fetchRemoteUrl({ url, name, audioContext }) {
        this.emitEvent({
            event: MIDI_LOAD_FILE,
            message: `Loading${this.formatMidiName(name)}...`
        });

        try {
            const response = await fetch(url);
            if (response.status !== 200) {
                this.emitEvent({
                    event: MIDI_ERROR,
                    message: `Could not retrieve MIDI${this.formatMidiName(
                        name
                    )} (status code: ${response.status}).`
                });

                return;
            }

            const arrayBuffer = await response.arrayBuffer();
            this.loadSong({ arrayBuffer, audioContext });
        } catch (error) {
            this.emitEvent({
                event: MIDI_ERROR,
                message: `Could not retrieve MIDI${this.formatMidiName(name)}.`
            });
        }
    }

    loadSong = ({ arrayBuffer, audioContext }) => {
        this.midiFileArray = new Int8Array(arrayBuffer);
        this.midiFileBuffer = LibTiMidity._malloc(this.midiFileArray.length);

        LibTiMidity.writeArrayToMemory(this.midiFileArray, this.midiFileBuffer);

        LibTiMidity.call('mid_init', 'number', [], []);

        this.stream = LibTiMidity.call(
            'mid_istream_open_mem',
            'number',
            ['number', 'number', 'number'],
            [this.midiFileBuffer, this.midiFileArray.length, false]
        );

        const options = LibTiMidity.call(
            'mid_create_options',
            'number',
            ['number', 'number', 'number', 'number'],
            [
                this.context.sampleRate,
                MIDI_AUDIO_S16LSB,
                1,
                MIDI_AUDIO_BUFFER_SIZE * 2
            ]
        );

        this.song = LibTiMidity.call(
            'mid_song_load',
            'number',
            ['number', 'number'],
            [this.stream, options]
        );

        LibTiMidity.call(
            'mid_istream_close',
            'number',
            ['number'],
            [this.stream]
        );

        this.missingPatchCount = LibTiMidity.call(
            'mid_song_get_num_missing_instruments',
            'number',
            ['number'],
            [this.song]
        );

        if (this.missingPatchCount > 0) {
            this.emitEvent({
                event: MIDI_LOAD_PATCH,
                message: 'Loading MIDI patches...'
            });

            for (let i = 0; i < this.missingPatchCount; i++) {
                const missingPatch = LibTiMidity.call(
                    'mid_song_get_missing_instrument',
                    'string',
                    ['number', 'number'],
                    [this.song, i]
                );

                this.loadMissingPatch({
                    path: this.patchUrl,
                    filename: missingPatch,
                    audioContext
                });
            }
        } else {
            this.initPlayback({ audioContext });
        }
    };

    async loadMissingPatch({ path, filename, audioContext }) {
        try {
            const response = await fetch(`${path}${filename}`);
            if (response.status !== 200) {
                this.emitEvent({
                    event: MIDI_ERROR,
                    message: `Could not retrieve instrument patch '${path}${filename}' (status code: ${request.status}).`
                });

                return;
            }

            const arrayBuffer = await response.arrayBuffer();

            this.missingPatchCount = this.missingPatchCount - 1;

            // writes instrument patch
            LibTiMidity.FS.createDataFile(
                'pat/',
                filename,
                new Int8Array(arrayBuffer),
                true,
                true
            );

            if (this.missingPatchCount === 0) {
                this.stream = LibTiMidity.call(
                    'mid_istream_open_mem',
                    'number',
                    ['number', 'number', 'number'],
                    [this.midiFileBuffer, this.midiFileArray.length, false]
                );

                const options = LibTiMidity.call(
                    'mid_create_options',
                    'number',
                    ['number', 'number', 'number', 'number'],
                    [
                        this.context.sampleRate,
                        MIDI_AUDIO_S16LSB,
                        1,
                        MIDI_AUDIO_BUFFER_SIZE * 2
                    ]
                );

                this.song = LibTiMidity.call(
                    'mid_song_load',
                    'number',
                    ['number', 'number'],
                    [this.stream, options]
                );

                LibTiMidity.call(
                    'mid_istream_close',
                    'number',
                    ['number'],
                    [this.stream]
                );

                this.initPlayback({ audioContext });
            }
        } catch (error) {
            this.emitEvent({
                event: MIDI_ERROR,
                message: `Could not retrieve instrument patch '${path}${filename}'.`
            });
        }
    }

    initPlayback = ({ audioContext }) => {
        LibTiMidity.call('mid_song_start', 'void', ['number'], [this.song]);

        this.context = audioContext || new AudioContext();
        this.connectSource();
        this.waveBuffer = LibTiMidity._malloc(MIDI_AUDIO_BUFFER_SIZE * 2);

        let gainNode = this.context.createGain();
        gainNode.gain.value = 1;

        this.startTime = this.context.currentTime;
        this.emitEvent({ event: MIDI_PLAY, time: 0 });
    };

    // creates script processor with auto buffer size and a single output channel
    connectSource = () => {
        // Warning! This feature has been marked as deprecated: https://developer.mozilla.org/en-US/docs/Web/API/BaseAudioContext/createScriptProcessor
        // See issue: https://github.com/yvesgurcan/web-midi-player/issues/29
        this.source = this.context.createScriptProcessor(
            MIDI_AUDIO_BUFFER_SIZE,
            0,
            1
        );

        // event handler for next buffer full of audio data
        this.source.onaudioprocess = event => this.handleOutput(event);

        // connects the source to the context's destination (the speakers)
        this.source.connect(this.context.destination);
    };

    handleOutput({ outputBuffer }) {
        try {
            const time = this.context.currentTime - this.startTime;

            this.emitEvent({
                event: MIDI_PLAY,
                time
            });

            // collect new wave data from LibTiMidity into waveBuffer
            const readWaveBytes = LibTiMidity.call(
                'mid_song_read_wave',
                'number',
                ['number', 'number', 'number', 'number'],
                [this.song, this.waveBuffer, MIDI_AUDIO_BUFFER_SIZE * 2, false]
            );

            if (readWaveBytes === 0) {
                this.stop();
                this.emitEvent({
                    event: MIDI_END,
                    time
                });
                return;
            }

            // loop through the samples
            for (let i = 0; i < MIDI_AUDIO_BUFFER_SIZE; i++) {
                if (i < readWaveBytes) {
                    // converts PCM data from sint16 in C to number in JavaScript (range: -1.0 .. +1.0)
                    outputBuffer.getChannelData(0)[i] =
                        LibTiMidity.getValue(this.waveBuffer + 2 * i, 'i16') /
                        MAX_I16;
                } else {
                    // fill end of buffer with zeroes, may happen at the end of a piece
                    outputBuffer.getChannelData(0)[i] = 0;
                }
            }
        } catch (error) {
            this.emitEvent({
                event: MIDI_ERROR,
                message: 'Could not process audio.'
            });
        }
    }

    /**
     * Pauses playback of MIDI input.
     * @param {undefined}
     * @return {boolean} Whether playback was successfully paused or not.
     * @example
     * midiPlayer.pause();
     */
    pause() {
        try {
            this.context.suspend();
            const time = this.context.currentTime - this.startTime;
            this.emitEvent({
                event: MIDI_PAUSE,
                time
            });
            return true;
        } catch (error) {
            this.emitEvent({
                event: MIDI_ERROR,
                message: 'Could not pause playback.'
            });

            return false;
        }
    }

    /**
     * Resumes playback of MIDI input.
     * @param {undefined}
     * @return {boolean} Whether playback was successfully ressumed or not.
     * @example
     * midiPlayer.resume();
     */
    resume() {
        try {
            this.context.resume();
            const time = this.context.currentTime - this.startTime;
            this.emitEvent({
                event: MIDI_RESUME,
                time
            });

            return true;
        } catch (error) {
            this.emitEvent({
                event: MIDI_ERROR,
                message: 'Could not resume playback.'
            });

            return false;
        }
    }

    /**
     * Stops playback of MIDI input.
     * @param {undefined}
     * @return {boolean} Whether playback was successfully stopped or not.
     * @example
     * midiPlayer.stop();
     */
    stop() {
        try {
            if (this.source) {
                this.disconnectSource();

                // free libtimitdiy ressources
                LibTiMidity._free(this.waveBuffer);
                LibTiMidity._free(this.midiFileBuffer);

                LibTiMidity.call(
                    'mid_song_free',
                    'void',
                    ['number'],
                    [this.song]
                );

                LibTiMidity.call('mid_exit', 'void', [], []);

                this.song = 0;
            }

            this.startTime = 0;

            this.emitEvent({
                event: MIDI_STOP,
                time: 0
            });

            return true;
        } catch (error) {
            this.emitEvent({
                event: MIDI_ERROR,
                message: 'Could not stop playback.'
            });

            return false;
        }
    }

    // terminate playback
    disconnectSource = () => {
        this.source.disconnect();
        this.source = null;
    };

    /**
     * Send custom payloads to the event logger.
     * @function
     * @param {object} payload
     * @param {string} [payload.event] The name of the event.
     * @param {string} [payload.message] A message that described the event.
     * @example
     * const event = 'CUSTOM_EVENT';
     * const message = 'Something happened.';
     * midiPlayer.emitEvent({ event, message });
     */
    emitEvent = payload => {
        if (this.eventLogger) {
            this.eventLogger(payload);
        } else if (this.logging) {
            if (payload.event === MIDI_ERROR) {
                console.error(payload);
            } else {
                console.log(payload);
            }
        }
    };
}
