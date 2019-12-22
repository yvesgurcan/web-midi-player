import { MIDI_INIT, MIDI_ERROR } from './events';

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
        playerId = undefined
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
        const payloadWithId = {
            ...payload,
            playerId: this.playerId
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
}
