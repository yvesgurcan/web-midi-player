import MidiPlayer from '../src/MidiPlayer';
import { AudioContext, customPatchUrl, midiUrl, midiName } from './fixtures';
import { MIDI_DEFAULT_PATCH_URL } from '../src/constants';
import {
    MIDI_INIT,
    MIDI_ERROR,
    MIDI_STOP,
    MIDI_LOAD_FILE
} from '../src/events';

let midiPlayer = null;
let audioContext = null;
let eventLogger = null;

const consoleLog = console.log;
const consoleError = console.error;
const originalFetch = global.fetch;

function expectedEvent(eventName) {
    return expect.objectContaining({ event: eventName });
}

/**
 * Use the two functions below to temporary enable and then disable again logging.
 * Please note that tests relying on logging functions to be called will probably failed after logging is disabled again since Jest can't spy on actual function calls.
 * @example
 * // output will show on the console or be sent to event logger
 * enableLogging();
 * midiPlayer.play();
 * // output will now be disabled and logging functions will be mocked again
 * disableLogging();
 */
function disableLogging() {
    eventLogger = jest.fn();
    console.log = jest.fn();
    console.error = jest.fn();
}

function enableLogging() {
    eventLogger = payload => console.log(payload);
    console.log = consoleLog;
    console.error = consoleError;
}

disableLogging();

function mockFetch(callback = () => null) {
    global.fetch = jest.fn(callback);
}

function restoreFetch() {
    global.fetch = originalFetch;
}

// Note that the Web Audio API is not tested.
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

            // logging is completely turned OFF by default
            expect(midiPlayer.eventLogger).toBeUndefined();
            expect(midiPlayer.logging).toBe(false);

            // no event
            expect(eventLogger).not.toHaveBeenCalled();
            expect(console.log).not.toHaveBeenCalled();
            expect(console.error).not.toHaveBeenCalled();

            expect(midiPlayer.patchUrl).toBe(MIDI_DEFAULT_PATCH_URL);
        });

        test('Player should instantiate and send init event (console logging)', function() {
            midiPlayer = new MidiPlayer({ logging: true, audioContext });
            expect(midiPlayer).toBeInstanceOf(MidiPlayer);

            // console logging only
            expect(midiPlayer.eventLogger).toBeUndefined();
            expect(midiPlayer.logging).toBe(true);

            // event
            expect(eventLogger).not.toHaveBeenCalled();
            expect(console.log).toHaveBeenCalled();
            expect(console.error).not.toHaveBeenCalled();

            expect(midiPlayer.patchUrl).toBe(MIDI_DEFAULT_PATCH_URL);
        });

        test('Player should instantiate and send init event (event logger)', function() {
            midiPlayer = new MidiPlayer({ eventLogger, audioContext });
            expect(midiPlayer).toBeInstanceOf(MidiPlayer);

            // eventLogger only
            expect(midiPlayer.eventLogger).toBe(eventLogger);
            expect(midiPlayer.logging).toBe(false);

            // event
            expect(eventLogger).toHaveBeenCalledWith(expectedEvent(MIDI_INIT));
            expect(console.log).not.toHaveBeenCalled();
            expect(console.error).not.toHaveBeenCalled();

            expect(midiPlayer.patchUrl).toBe(MIDI_DEFAULT_PATCH_URL);
        });

        test('Player should instantiate with a custom URL to find instrument patches', function() {
            midiPlayer = new MidiPlayer({
                patchUrl: customPatchUrl,
                audioContext
            });
            expect(midiPlayer).toBeInstanceOf(MidiPlayer);
            expect(midiPlayer.patchUrl).toBe(customPatchUrl);
        });
    });

    describe('Play', () => {
        beforeAll(function() {
            audioContext = new AudioContext();
        });

        beforeEach(function() {
            midiPlayer = null;
            mockFetch();
        });

        afterEach(function() {
            restoreFetch();
        });

        test('Player should send an error event if no array buffer or URL was provided (console logging)', function() {
            midiPlayer = new MidiPlayer({ logging: true, audioContext });

            midiPlayer.play({ audioContext });

            expect(console.error).toHaveBeenLastCalledWith(
                expectedEvent(MIDI_ERROR)
            );
        });

        test('Player should send an error event if no array buffer or URL was provided (event logger)', function() {
            midiPlayer = new MidiPlayer({ eventLogger, audioContext });

            midiPlayer.play({ audioContext });

            expect(eventLogger).toHaveBeenLastCalledWith(
                expectedEvent(MIDI_ERROR)
            );
        });

        test('Player should fetch URL and send play-related events (console logging)', function() {
            midiPlayer = new MidiPlayer({ logging: true, audioContext });

            midiPlayer.play({ url: midiUrl, name: midiName, audioContext });

            expect(global.fetch).toHaveBeenCalledWith(midiUrl);

            expect(console.log).toHaveBeenNthCalledWith(
                2,
                expectedEvent(MIDI_STOP)
            );

            expect(console.log).toHaveBeenNthCalledWith(
                3,
                expectedEvent(MIDI_LOAD_FILE)
            );

            expect(console.error).not.toHaveBeenCalled();
        });

        test('Player should fetch URL and send play-related events (event logger)', function() {
            midiPlayer = new MidiPlayer({ eventLogger, audioContext });

            midiPlayer.play({ url: midiUrl, name: midiName, audioContext });

            expect(global.fetch).toHaveBeenCalledWith(midiUrl);

            expect(eventLogger).toHaveBeenNthCalledWith(
                2,
                expectedEvent(MIDI_STOP)
            );

            expect(eventLogger).toHaveBeenNthCalledWith(
                3,
                expectedEvent(MIDI_LOAD_FILE)
            );

            expect(eventLogger).not.toHaveBeenCalledWith(
                expectedEvent(MIDI_ERROR)
            );
        });
    });
});
