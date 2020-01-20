const { default: MidiPlayer } = window['midi-player'];

const MIDI_ERROR = 'MIDI_ERROR';

let midiPlayer = null;

const eventLogger = payload => {
    console[event === MIDI_ERROR ? 'error' : 'log'](payload);
};

midiPlayer = new MidiPlayer({ eventLogger, patchUrl: 'patches/' });

const songElements = document.getElementsByClassName('Player__Song');

Array.from(songElements).forEach(songElement => {
    songElement.onclick = () => {
        midiPlayer.play({ url: `../midi/${songElement.id}` });
    };
});
