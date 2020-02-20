let _instance = null;

const MIDI_PLAYER_PREFIX = 'midiPlayer';

const formatKey = string =>
    `${MIDI_PLAYER_PREFIX}${String(string[0]).toUpperCase()}${string.substring(
        1
    )}`;

export default class LocalStorageManager {
    constructor() {
        if (_instance) {
            return _instance;
        }
    }

    async getItem(key) {
        try {
            const items = await localStorage.getItem(formatKey(key));
            const parsed = JSON.parse(items);
            return parsed;
        } catch (error) {
            console.error({ error });
            return null;
        }
    }

    setItem(key, value) {
        try {
            const stringified = JSON.stringify(value);
            return localStorage.setItem(formatKey(key), stringified);
        } catch (error) {
            console.error({ error });
        }
    }
}
