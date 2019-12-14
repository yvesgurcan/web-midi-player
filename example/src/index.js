import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';
import MidiPlayer from 'web-midi-player';

const GITHUB_REPO = 'https://github.com/yvesgurcan/web-midi-player';
const DOCS = 'https://midi.yvesgurcan.com/docs';
const README = 'https://midi.yvesgurcan.com/';

const MIDI_PLAY = 'MIDI_PLAY';
const MIDI_PAUSE = 'MIDI_PAUSE';
const MIDI_END = 'MIDI_END';
const MIDI_ERROR = 'MIDI_ERROR';

const PATCH_URL = 'patches/';

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
    }
    // this breaks the player
    /*{
        url: 'midi/this-file-is-not-a-midi.wav',
        name: 'Not a MIDI file.'
    }*/
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

let midiPlayer = null;

const Example = () => {
    const [currentSongIndex, setCurrentSongIndex] = useState(0);
    const [currentSongState, setCurrentSongState] = useState(null);
    const [currentSongTime, setCurrentSongTime] = useState(0);

    useEffect(() => {
        if (!midiPlayer) {
            const eventLogger = ({ message, event, time }) => {
                console[event === MIDI_ERROR ? 'error' : 'log'](
                    event,
                    message || '',
                    time
                );
                setCurrentSongState(event);
                setCurrentSongTime(time || 0);

                if (event === MIDI_END) {
                    let nextIndex = currentSongIndex + 1;
                    if (nextIndex > SONGS.length - 1) {
                        nextIndex = 0;
                    }
                    const { url, name } = SONGS[nextIndex];
                    midiPlayer.play({ url, name });
                    setCurrentSongIndex(nextIndex);
                }
            };

            midiPlayer = new MidiPlayer({ eventLogger, patchUrl: PATCH_URL });
            setCurrentSongState('MIDI player initialized.');
        }
    });

    return (
        <View>
            <Player>
                <Heading>web-midi-player</Heading>
                <Help>
                    <Link
                        href={GITHUB_REPO}
                        target="_blank"
                        noopener
                        noreferrer
                    >
                        Repository
                    </Link>

                    <Link href={DOCS} target="_blank" noopener noreferrer>
                        Documentation
                    </Link>
                    <Link href={README} target="_blank" noopener noreferrer>
                        Readme
                    </Link>
                </Help>
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
                    <Button
                        title="Stop track"
                        onClick={() => midiPlayer.stop()}
                    >
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
                <PlaybackTime>
                    {Math.floor(currentSongTime)} seconds
                </PlaybackTime>
            </Player>
        </View>
    );
};

const View = styled.div`
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background: black;
`;

const Player = styled.div`
    background: rgb(125, 125, 125);
    color: white;
    padding: 20px;
    border-radius: 10px;
    min-height: 75px;
    min-width: 400px;
`;

const Heading = styled.h1`
    text-align: center;
    margin: 0;
`;

const Help = styled.div`
    display: flex;
    justify-content: space-around;
`;

const Link = styled.a`
    display: block;
    color: white;
    margin: 10px;
    text-align: center;
`;

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

ReactDOM.render(<Example />, document.getElementById('app'));
