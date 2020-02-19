export class AudioContext {
    constructor() {}
    suspend() {}
    resume() {}
    createGain() {
        return gainNode;
    }
    close() {}
    get currentTime() {
        return 0;
    }
}

const gainNode = {
    gain: {
        value: 1
    }
};

export const customPatchUrl = '/my/pat/url/';

export const midiUrl = 'song.mid';

export const midiName = 'test MIDI';
