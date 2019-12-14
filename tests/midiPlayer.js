import MidiPlayer from '../src/MidiPlayer';
import { eventLogger } from './fixtures';

// Note that the Web Audio API is not tested.

let midiPlayer = null;
describe('MidiPlayer', function() {
    describe('Instantiation', function() {
        beforeEach(function() {
            midiPlayer = null;
        });

        test('Player should instantiate', () => {
            midiPlayer = new MidiPlayer();
            expect(midiPlayer).toBeInstanceOf(MidiPlayer);
            expect(midiPlayer.eventLogger).toBeUndefined();
            expect(midiPlayer.logging).toBe(false);
        });

        test('Player should instantiate with event logger', function() {
            midiPlayer = new MidiPlayer({ eventLogger });
            expect(midiPlayer).toBeInstanceOf(MidiPlayer);
            expect(midiPlayer.eventLogger).toBe(eventLogger);
            expect(midiPlayer.logging).toBe(false);
        });

        test('Player should instantiate with console logging turned ON', function() {
            midiPlayer = new MidiPlayer({ logging: true });
            expect(midiPlayer).toBeInstanceOf(MidiPlayer);
            expect(midiPlayer.eventLogger).toBeUndefined();
            expect(midiPlayer.logging).toBe(true);
        });
    });
});
