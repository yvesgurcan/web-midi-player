const {
    'web-midi-player': { default: MidiPlayer }
} = window;

const MIDI_ERROR = 'MIDI_ERROR';

let midiPlayer = null;

const eventLogger = payload => {
    console[event === MIDI_ERROR ? 'error' : 'log'](payload);
};

midiPlayer = new MidiPlayer({ eventLogger, patchUrl: 'patches/' });

const songElements = document.getElementsByClassName('Player__Song');

Array.from(songElements).forEach(songElement => {
    songElement.onclick = () => {
        Array.from(songElements).forEach(sgElem => {
            sgElem.style.fontWeight = null;
        });
        songElement.style.fontWeight = 'bold';
        midiPlayer.play({ url: `../midi/${songElement.id}` });
    };
});

const buttonElements = document.getElementsByClassName('Player__Button');

Array.from(buttonElements).forEach(buttonElement => {
    buttonElement.onclick = () => {
        midiPlayer.stop();
    };
});
