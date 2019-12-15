import MidiPlayer from '../src/MidiPlayer';
import { eventLogger, AudioContext } from './fixtures';

// Note that the Web Audio API is not tested.

let midiPlayer = null;
let audioContext = null;

describe('MidiPlayer', function() {
    describe('Instantiation', function() {
        beforeAll(function() {
            audioContext = new AudioContext();
        });

        beforeEach(function() {
            midiPlayer = null;
        });

        test('Player should instantiate', () => {
            midiPlayer = new MidiPlayer({ audioContext });
            expect(midiPlayer).toBeInstanceOf(MidiPlayer);
            expect(midiPlayer.eventLogger).toBeUndefined();
            expect(midiPlayer.logging).toBe(false);
        });

        test('Player should instantiate with event logger', function() {
            midiPlayer = new MidiPlayer({ eventLogger, audioContext });
            expect(midiPlayer).toBeInstanceOf(MidiPlayer);
            expect(midiPlayer.eventLogger).toBe(eventLogger);
            expect(midiPlayer.logging).toBe(false);
        });

        test('Player should instantiate with logging turned ON', function() {
            midiPlayer = new MidiPlayer({ logging: true, audioContext });
            expect(midiPlayer).toBeInstanceOf(MidiPlayer);
            expect(midiPlayer.eventLogger).toBeUndefined();
            expect(midiPlayer.logging).toBe(true);
        });
    });
});
