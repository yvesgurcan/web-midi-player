import MidiPlayer from '../src/MidiPlayer';
import { AudioContext, customPatchUrl, midiUrl, midiName } from './fixtures';
import { MIDI_DEFAULT_PATCH_URL } from '../src/constants';
import {
    MIDI_INIT,
    MIDI_ERROR,
    MIDI_STOP,
    MIDI_LOAD_FILE,
    MIDI_PAUSE,
    MIDI_RESUME,
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
    console.log = jest.fn();
    console.error = jest.fn();
    eventLogger = jest.fn();
}

function enableLogging() {
    console.log = consoleLog;
    console.error = consoleError;
    eventLogger = (payload) => consoleLog(payload);
}

disableLogging();

function mockFetch(callback = () => null) {
    global.fetch = jest.fn(callback);
}

function restoreFetch() {
    global.fetch = originalFetch;
}

// Note that the Web Audio API is not tested.
describe('MidiPlayer', function () {
    describe('Instantiation', function () {
        beforeEach(function () {
            midiPlayer = null;
        });

        test('Player should instantiate', () => {
            midiPlayer = new MidiPlayer();
            expect(midiPlayer).toBeInstanceOf(MidiPlayer);
            expect(midiPlayer.playerId).not.toBeUndefined();

            // logging is completely turned OFF by default
            expect(midiPlayer.eventLogger).toBeUndefined();
            expect(midiPlayer.logging).toBe(false);

            // no event
            expect(eventLogger).not.toHaveBeenCalled();
            expect(console.log).not.toHaveBeenCalled();
            expect(console.error).not.toHaveBeenCalled();

            expect(midiPlayer.patchUrl).toBe(MIDI_DEFAULT_PATCH_URL);
        });

        test('Player should instantiate and send init event (console logging)', function () {
            midiPlayer = new MidiPlayer({ logging: true });
            expect(midiPlayer).toBeInstanceOf(MidiPlayer);
            expect(midiPlayer.playerId).not.toBeUndefined();

            // console logging only
            expect(midiPlayer.eventLogger).toBeUndefined();
            expect(midiPlayer.logging).toBe(true);

            // event
            expect(eventLogger).not.toHaveBeenCalled();
            expect(console.log).toHaveBeenCalled();
            expect(console.error).not.toHaveBeenCalled();

            expect(midiPlayer.patchUrl).toBe(MIDI_DEFAULT_PATCH_URL);
        });

        test('Player should instantiate and send init event (custom event logger)', function () {
            midiPlayer = new MidiPlayer({ eventLogger });
            expect(midiPlayer).toBeInstanceOf(MidiPlayer);
            expect(midiPlayer.playerId).not.toBeUndefined();

            // eventLogger only
            expect(midiPlayer.eventLogger).toBe(eventLogger);
            expect(midiPlayer.logging).toBe(false);

            // event
            expect(eventLogger).toHaveBeenCalledWith(expectedEvent(MIDI_INIT));
            expect(console.log).not.toHaveBeenCalled();
            expect(console.error).not.toHaveBeenCalled();

            expect(midiPlayer.patchUrl).toBe(MIDI_DEFAULT_PATCH_URL);
        });

        test('Player should instantiate with a custom URL to find instrument patches', function () {
            midiPlayer = new MidiPlayer({
                patchUrl: customPatchUrl,
            });
            expect(midiPlayer).toBeInstanceOf(MidiPlayer);
            expect(midiPlayer.playerId).not.toBeUndefined();
            expect(midiPlayer.patchUrl).toBe(customPatchUrl);
        });
    });

    describe('Play', () => {
        beforeAll(function () {
            audioContext = new AudioContext();
        });

        beforeEach(function () {
            midiPlayer = null;
            mockFetch();
        });

        afterEach(function () {
            restoreFetch();
        });

        test('Player should send an error event if no array buffer or URL was provided (console logging)', function () {
            midiPlayer = new MidiPlayer({ logging: true });

            midiPlayer.play({ audioContext });

            expect(console.error).toHaveBeenLastCalledWith(
                expectedEvent(MIDI_ERROR)
            );
        });

        test('Player should send an error event if no array buffer or URL was provided (custom event logger)', function () {
            midiPlayer = new MidiPlayer({ eventLogger });

            midiPlayer.play({ audioContext });

            expect(eventLogger).toHaveBeenLastCalledWith(
                expectedEvent(MIDI_ERROR)
            );
        });

        test('Player should fetch URL and send play-related events (console logging)', function () {
            midiPlayer = new MidiPlayer({ logging: true });

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

        test('Player should fetch URL and send play-related events (custom event logger)', function () {
            midiPlayer = new MidiPlayer({ eventLogger });

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

    describe('Pause', () => {
        beforeAll(function () {
            audioContext = new AudioContext();
        });

        beforeEach(function () {
            midiPlayer = null;
        });

        test('Player should send a pause event (console logging)', function () {
            midiPlayer = new MidiPlayer({ logging: true, audioContext });

            midiPlayer.pause();

            expect(console.log).toHaveBeenLastCalledWith(
                expectedEvent(MIDI_PAUSE)
            );
        });

        test('Player should send a pause event (custom event logger)', function () {
            midiPlayer = new MidiPlayer({ eventLogger, audioContext });

            midiPlayer.pause();

            expect(eventLogger).toHaveBeenLastCalledWith(
                expectedEvent(MIDI_PAUSE)
            );
        });
    });

    describe('Resume', () => {
        beforeAll(function () {
            audioContext = new AudioContext();
        });

        beforeEach(function () {
            midiPlayer = null;
        });

        test('Player should send a resume event (console logging)', function () {
            midiPlayer = new MidiPlayer({ logging: true, audioContext });

            midiPlayer.resume();

            expect(console.log).toHaveBeenLastCalledWith(
                expectedEvent(MIDI_RESUME)
            );
        });

        test('Player should send a resume event (custom event logger)', function () {
            midiPlayer = new MidiPlayer({ eventLogger, audioContext });

            midiPlayer.resume();

            expect(eventLogger).toHaveBeenLastCalledWith(
                expectedEvent(MIDI_RESUME)
            );
        });
    });

    describe('Stop', () => {
        beforeAll(function () {
            audioContext = new AudioContext();
        });

        beforeEach(function () {
            midiPlayer = null;
        });

        test('Player should send a stop event (console logging)', function () {
            midiPlayer = new MidiPlayer({ logging: true });

            midiPlayer.stop();

            expect(console.log).toHaveBeenLastCalledWith(
                expectedEvent(MIDI_STOP)
            );
        });

        test('Player should send a stop event (custom event logger)', function () {
            midiPlayer = new MidiPlayer({ eventLogger });

            midiPlayer.stop();

            expect(eventLogger).toHaveBeenLastCalledWith(
                expectedEvent(MIDI_STOP)
            );
        });
    });
});
