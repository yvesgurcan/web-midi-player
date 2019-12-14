import { MIDI_INIT, MIDI_ERROR } from './events';

export default class EventHandler {
    /**
     * @class EventHandler
     * @param {object} [configuration]
     * @param {function} [configuration.eventLogger = undefined] The function that receives event payloads.
     * @param {boolean} [configuration.logging = false] Turns ON or OFF logging to the console.
     * @return {object} An `EventHandler` instance.
     */
    constructor({ eventLogger = undefined, logging = false }) {
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
            message: 'MIDI player initialized.'
        });
    }

    /**
     * Send payloads to the event logger.
     * @function
     * @param {object} payload
     * @param {string} [payload.event] The name of the event.
     * @param {string} [payload.message] A message that described the event.
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
