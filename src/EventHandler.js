import {
    MIDI_INIT,
    MIDI_LOAD_FILE,
    MIDI_LOAD_PATCH,
    MIDI_PLAY,
    MIDI_PAUSE,
    MIDI_RESUME,
    MIDI_STOP,
    MIDI_END,
    MIDI_ERROR,
} from './events';

export default class EventHandler {
    /**
     * @class EventHandler
     * @param {object} [configuration]
     * @param {string} [configuration.playerId = undefined] The ID of the Midi Player that sends events.
     * @param {function} [configuration.eventLogger = undefined] The function that receives event payloads.
     * @param {boolean} [configuration.logging = false] Turns ON or OFF logging to the console.
     * @return {object} An `EventHandler` instance.
     */
    constructor({
        eventLogger = undefined,
        logging = false,
        playerId = undefined,
    }) {
        this.playerId = playerId;
        this.logging = logging;
        this.eventLogger = eventLogger;
    }

    /**
     * Emits an event that indicates that the MIDI player is initialized.
     * @function
     * @param {undefined}
     */
    emitInit() {
        this.emitEvent({
            event: MIDI_INIT,
            message: 'MIDI player initialized.',
        });
    }

    /**
     * Emits an event that indicates that a MIDI file is being loaded.
     * @function
     * @param {object} payload
     * @param {string} [payload.message] A message about the MIDI file being loaded.
     */
    emitLoadFile = ({ message = 'Loading MIDI file...' }) => {
        this.emitEvent({
            event: MIDI_LOAD_FILE,
            message,
        });
    };

    /**
     * Emits an event that indicates that a MIDI instrument patch is being loaded.
     * @function
     * @param {object} payload
     * @param {string} [payload.message] A message about the instrument patch being loaded.
     */
    emitLoadPatch = ({ message = 'Loading instrument patch...' }) => {
        this.emitEvent({
            event: MIDI_LOAD_PATCH,
            message,
        });
    };

    /**
     * Emits an event that indicates that the MIDI player currently playing a MIDI file.
     * @function
     * @param {object} payload
     * @param {string} [payload.time] The playback position.
     */
    emitPlay({ time }) {
        this.emitEvent({
            event: MIDI_PLAY,
            time,
        });
    }

    /**
     * Emits an event that indicates that the MIDI player has paused the playback of a file.
     * @function
     * @param {object} payload
     * @param {string} [payload.time] The playback position.
     */
    emitPause({ time }) {
        this.emitEvent({
            event: MIDI_PAUSE,
            time,
        });
    }

    /**
     * Emits an event that indicates that the MIDI player has resumed the playback of a file.
     * @function
     * @param {object} payload
     * @param {string} [payload.time] The playback position.
     */
    emitResume({ time }) {
        this.emitEvent({
            event: MIDI_RESUME,
            time,
        });
    }

    /**
     * Emits an event that indicates that the MIDI player has stopped the playback of a file.
     * @function
     * @param {undefined}
     */
    emitStop() {
        this.emitEvent({
            event: MIDI_STOP,
            time: 0,
        });
    }

    /**
     * Emits an event that indicates that the MIDI player has reached the end of a file.
     * @function
     * @param {object} payload
     * @param {string} [payload.time] The playback position.
     */
    emitEnd({ time }) {
        this.emitEvent({
            event: MIDI_END,
            time,
        });
    }

    /**
     * Emits an event that indicates that an error prevented the MIDI player to continue.
     * @function
     * @param {object} payload
     * @param {string} [payload.message] A message that indicates that an error occurred.
     * @param {string} [payload.error] A message that describes the details of the error.
     */
    emitError = ({ message = 'An error occurred.', error = '' }) => {
        this.emitEvent({
            event: MIDI_ERROR,
            message,
            error,
        });
    };

    /**
     * Send payloads to the event logger.
     * @function
     * @param {object} payload
     * @param {string} [payload.event] The name of the event.
     * @param {string} [payload.message] A message that describes the event.
     */
    emitEvent = (payload) => {
        const payloadWithId = {
            ...payload,
            playerId: this.playerId,
        };

        if (this.eventLogger) {
            this.eventLogger(payloadWithId);
        } else if (this.logging) {
            if (payloadWithId.event === MIDI_ERROR) {
                console.error(payloadWithId);
            } else {
                console.log(payloadWithId);
            }
        }
    };

    /**
     * Updates the configuration of the logger.
     * @function
     * @param {object} [configuration]
     * @param {function} [configuration.eventLogger = undefined] The function that receives event payloads.
     * @param {boolean} [configuration.logging = false] Turns ON or OFF logging to the console.
     */
    setLogger({ eventLogger = undefined, logging = false }) {
        this.eventLogger = eventLogger;

        this.logging = logging;
    }
}
