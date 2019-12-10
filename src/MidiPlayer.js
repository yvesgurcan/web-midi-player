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

import Module from './LibTimidity';

export default class MidiPlayer {
    /**
     * @class MidiPlayer
     * @param {object} [configuration]
     * @param {function} [configuration.eventLogger = undefined] The function that receives event payloads.
     * @param {boolean} [configuration.logging = false] Turns ON or OFF logging to the console.
     * @param {string} [configuration.patchUrl = /public/midi/pat/] The public path where MIDI instrument patches can be found.
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
        patchUrl = MIDI_DEFAULT_PATCH_URL
    } = {}) {
        this.logging = logging;
        this.eventLogger = eventLogger;
        this.patchUrl = patchUrl;

        try {
            window.AudioContext =
                window.AudioContext || window.webkitAudioContext;
            this.context = new AudioContext();
            this.audioMethod = 'WebAudioAPI';
            this.audioStatus = `audioMethod: WebAudioAPI, sampleRate (Hz): ${this.context.sampleRate}, audioBufferSize (Byte): ${MIDI_AUDIO_BUFFER_SIZE}`;
        } catch (e) {
            this.emitEvent({
                event: MIDI_ERROR,
                message: 'Could not initialize AudioContext.'
            });
        }
    }

    getNextWave(event) {
        const time = this.context.currentTime - this.startTime;

        this.emitEvent({
            event: MIDI_PLAY,
            time
        });

        // collect new wave data from libtimidity into waveBuffer
        const readWaveBytes = Module.ccall(
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

        for (let i = 0; i < MIDI_AUDIO_BUFFER_SIZE; i++) {
            if (i < readWaveBytes) {
                // convert PCM data from C sint16 to JavaScript number (range -1.0 .. +1.0)
                event.outputBuffer.getChannelData(0)[i] =
                    Module.getValue(this.waveBuffer + 2 * i, 'i16') / MAX_I16;
            } else {
                // fill end of buffer with zeroes, may happen at the end of a piece
                event.outputBuffer.getChannelData(0)[i] = 0;
            }
        }
    }

    initWebAudioPlayback = () => {
        this.context = new AudioContext();
        // create script Processor with auto buffer size and a single output channel
        this.source = this.context.createScriptProcessor(
            MIDI_AUDIO_BUFFER_SIZE,
            0,
            1
        );
        this.waveBuffer = Module._malloc(MIDI_AUDIO_BUFFER_SIZE * 2);

        var gainNode = this.context.createGain();
        gainNode.gain.value = 1;

        // eventhandler for next buffer full of audio data
        this.source.onaudioprocess = event => {
            return this.getNextWave(event);
        };

        this.source.connect(this.context.destination); // connect the source to the context's destination (the speakers)
        this.startTime = this.context.currentTime;

        this.emitEvent({ event: MIDI_PLAY, time: 0 });
    };

    loadMissingPatch(path, filename) {
        const request = new XMLHttpRequest();
        request.open('GET', `${path}${filename}`, true);
        request.responseType = 'arraybuffer';

        request.onerror = () =>
            this.emitEvent({
                event: MIDI_ERROR,
                message: `Cannot retrieve MIDI patch '${filename}'.`
            });

        request.onload = () => {
            if (request.status !== 200) {
                this.emitEvent({
                    event: MIDI_ERROR,
                    message: `Cannot retrieve MIDI patch '${filename}' (status code: ${request.status}).`
                });
                return;
            }

            this.missingPatchCount = this.missingPatchCount - 1;
            Module.FS.createDataFile(
                'pat/',
                filename,
                new Int8Array(request.response),
                true,
                true
            );

            if (this.missingPatchCount === 0) {
                this.stream = Module.ccall(
                    'mid_istream_open_mem',
                    'number',
                    ['number', 'number', 'number'],
                    [this.midiFileBuffer, this.midiFileArray.length, false]
                );

                const options = Module.ccall(
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

                this.song = Module.ccall(
                    'mid_song_load',
                    'number',
                    ['number', 'number'],
                    [this.stream, options]
                );

                Module.ccall(
                    'mid_istream_close',
                    'number',
                    ['number'],
                    [this.stream]
                );

                Module.ccall('mid_song_start', 'void', ['number'], [this.song]);

                this.initWebAudioPlayback();
            }
        };
        request.send();
    }

    loadSong = arrayBuffer => {
        this.midiFileArray = new Int8Array(arrayBuffer);
        this.midiFileBuffer = Module._malloc(this.midiFileArray.length);
        Module.writeArrayToMemory(this.midiFileArray, this.midiFileBuffer);

        Module.ccall('mid_init', 'number', [], []);

        this.stream = Module.ccall(
            'mid_istream_open_mem',
            'number',
            ['number', 'number', 'number'],
            [this.midiFileBuffer, this.midiFileArray.length, false]
        );

        const options = Module.ccall(
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

        this.song = Module.ccall(
            'mid_song_load',
            'number',
            ['number', 'number'],
            [this.stream, options]
        );
        Module.ccall('mid_istream_close', 'number', ['number'], [this.stream]);

        this.missingPatchCount = Module.ccall(
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
                const missingPatch = Module.ccall(
                    'mid_song_get_missing_instrument',
                    'string',
                    ['number', 'number'],
                    [this.song, i]
                );

                this.loadMissingPatch(this.patchUrl, missingPatch);
            }
        } else {
            Module.ccall('mid_song_start', 'void', ['number'], [this.song]);

            this.initWebAudioPlayback();
        }
    };

    playWebAudioAPIWithScriptLoaded(url, name) {
        this.emitEvent({
            event: MIDI_LOAD_FILE,
            message: `Loading '${name}'...`
        });

        // Download url from server, url must honor same origin restriction
        const request = new XMLHttpRequest();
        request.open('GET', url, true);
        request.responseType = 'arraybuffer';

        request.onerror = () =>
            this.emitEvent({
                event: MIDI_ERROR,
                message: `Could not retrieve MIDI for '${name}'.`
            });

        request.onload = () => {
            try {
                if (request.status !== 200) {
                    this.emitEvent({
                        event: MIDI_ERROR,
                        message: `Could not retrieve MIDI for '${name}' (status code: ${request.status}).`
                    });

                    return;
                }

                this.loadSong(request.response);
            } catch (error) {
                this.emitEvent({
                    event: MIDI_ERROR,
                    message: error
                });
            }
        };
        request.send();
    }

    /**
     * Starts playback of MIDI input.
     *
     * Please note that you can not use `input.arrayBuffer` and `input.url` concurrently.
     * @param {object} input
     * @param {arrayBuffer} [input.arrayBuffer] An array buffer containing MIDI data.
     * @param {string} [input.url] The URL where the MIDI file is located.
     * @param {string} [input.name] A human-friendly name for the song.
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
    play({ arrayBuffer, url, name }) {
        this.stop();

        if (url) {
            this.playWebAudioAPIWithScriptLoaded(url, name);
        } else if (arrayBuffer) {
            this.emitEvent({
                event: MIDI_LOAD_FILE,
                message: `Loading '${name}'...`
            });
            this.loadSong(arrayBuffer);
        } else {
            this.emitEvent({
                event: MIDI_ERROR,
                message: 'Unknown source. Must pass either url or arrayBuffer.'
            });
            return false;
        }

        return true;
    }

    /**
     * Pauses playback of MIDI input.
     * @param {undefined}
     * @return {boolean} Whether playback was successfully paused or not.
     * @example
     * midiPlayer.pause();
     */
    pause() {
        this.context.suspend();

        const time = this.context.currentTime - this.startTime;
        this.emitEvent({
            event: MIDI_PAUSE,
            time
        });
        return true;
    }

    /**
     * Resumes playback of MIDI input.
     * @param {undefined}
     * @return {boolean} Whether playback was successfully ressumed or not.
     * @example
     * midiPlayer.resume();
     */
    resume() {
        this.context.resume();

        const time = this.context.currentTime - this.startTime;
        this.emitEvent({
            event: MIDI_RESUME,
            time
        });

        return true;
    }

    /**
     * Stops playback of MIDI input.
     * @param {undefined}
     * @return {boolean} Whether playback was successfully stopped or not.
     * @example
     * midiPlayer.stop();
     */
    stop() {
        if (this.source) {
            // terminate playback
            this.source.disconnect();

            // hack: without this, Firfox 25 keeps firing the onaudioprocess callback
            this.source.onaudioprocess = 0;

            this.source = 0;

            // free libtimitdiy ressources
            Module._free(this.waveBuffer);
            Module._free(this.midiFileBuffer);

            Module.ccall('mid_song_free', 'void', ['number'], [this.song]);

            Module.ccall('mid_exit', 'void', [], []);

            this.song = 0;
        }

        this.emitEvent({
            event: MIDI_STOP,
            time: 0
        });

        return true;
    }

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
            console.log(payload);
        }
    };
}
