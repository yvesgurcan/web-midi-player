import React, { Fragment, useState, useEffect } from 'react';
import styled from 'styled-components';
import MidiPlayer from 'web-midi-player';

const MIDI_PLAY = 'MIDI_PLAY';
const MIDI_PAUSE = 'MIDI_PAUSE';
const MIDI_END = 'MIDI_END';
const MIDI_ERROR = 'MIDI_ERROR';

const SONGS = [
    { url: 'midi/d_runnin.mid', name: 'Running from evil - Bobby Prince' },
    {
        url: 'midi/fatcmdr.mid',
        name: 'Going after the fat commander - Bobby Prince'
    },
    {
        url: 'midi/veggies.mid',
        name: "You've got to eat your vegetables - Bobby Prince"
    },
    {
        url: 'midi/this-file-does-not-exist.mid',
        name: 'Broken URL to MIDI file.'
    },
    {
        url: 'midi/this-file-is-not-a-midi.wav',
        name: 'Not a MIDI file.'
    }
];

const getPlayPauseButton = (songState, songIndex, player) => {
    switch (songState) {
        default: {
            const { url, name } = SONGS[songIndex];
            return (
                <Button
                    onClick={() =>
                        player.play({
                            url,
                            name
                        })
                    }
                >
                    ▶️
                </Button>
            );
        }
        case MIDI_PLAY: {
            return <Button onClick={() => player.pause()}>⏸️</Button>;
        }
        case MIDI_PAUSE: {
            return <Button onClick={() => player.resume()}>▶️</Button>;
        }
    }
};

const Player = () => {
    const [midiPlayer, setMidiPlayer] = useState(null);
    const [currentSongIndex, setCurrentSongIndex] = useState(0);
    const [currentSongState, setCurrentSongState] = useState(null);
    const [currentSongTime, setCurrentSongTime] = useState(0);

    useEffect(() => {
        if (!midiPlayer) {
            const eventLogger = payload => {
                console[event === MIDI_ERROR ? 'error' : 'log'](payload);
                setCurrentSongState(payload.event);
                setCurrentSongTime(payload.time || 0);

                if (payload.event === MIDI_END) {
                    let nextIndex = currentSongIndex + 1;
                    if (nextIndex > SONGS.length - 1) {
                        nextIndex = 0;
                    }
                    const { url, name } = SONGS[nextIndex];
                    midiPlayer.play({ url, name });
                    setCurrentSongIndex(nextIndex);
                }
            };

            setMidiPlayer(new MidiPlayer({ eventLogger }));
        }
    });

    return (
        <Fragment>
            <Playlist>
                {SONGS.map(({ url, name }, index) => (
                    <Song
                        key={url}
                        first={index === 0}
                        selected={currentSongIndex === index}
                        onClick={() => {
                            midiPlayer.play({ url, name });
                            setCurrentSongIndex(index);
                        }}
                    >
                        {name}
                    </Song>
                ))}
            </Playlist>
            <Control>
                {getPlayPauseButton(
                    currentSongState,
                    currentSongIndex,
                    midiPlayer
                )}
                <Button title="Stop track" onClick={() => midiPlayer.stop()}>
                    ⏹️
                </Button>
                <Button
                    title="Previous track"
                    onClick={() => {
                        let prevIndex = currentSongIndex - 1;
                        if (prevIndex < 0) {
                            prevIndex = SONGS.length - 1;
                        }
                        const { url, name } = SONGS[prevIndex];
                        midiPlayer.play({ url, name });
                        setCurrentSongIndex(prevIndex);
                    }}
                >
                    ⏮
                </Button>
                <Button
                    title="Next track"
                    onClick={() => {
                        let nextIndex = currentSongIndex + 1;
                        if (nextIndex > SONGS.length - 1) {
                            nextIndex = 0;
                        }
                        const { url, name } = SONGS[nextIndex];
                        midiPlayer.play({ url, name });
                        setCurrentSongIndex(nextIndex);
                    }}
                >
                    ⏭
                </Button>
            </Control>
            <PlaybackState>{currentSongState}</PlaybackState>
            <PlaybackTime>{Math.floor(currentSongTime)} seconds</PlaybackTime>
        </Fragment>
    );
};

const Playlist = styled.div`
    margin-bottom: 10px;
`;

const Song = styled.div(
    props => `
    border-bottom: 1px solid white;
    border-left: 1px solid white;
    border-right: 1px solid white;
    padding: 5px;
    cursor: pointer;
    ${props.first && 'border-top: 1px solid white'};
    ${props.selected && 'font-weight: bold'};
`
);

const Control = styled.div`
    display: flex;
    justify-content: center;
`;

const Button = styled.div`
    cursor: pointer;
    margin: 5px;
`;

const PlaybackState = styled.div`
    text-align: center;
`;

const PlaybackTime = styled.div`
    text-align: center;
`;

export default Player;
