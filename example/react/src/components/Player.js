import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import MidiPlayer from 'web-midi-player';

const MIDI_PLAY = 'MIDI_PLAY';
const MIDI_PAUSE = 'MIDI_PAUSE';
const MIDI_END = 'MIDI_END';
const MIDI_ERROR = 'MIDI_ERROR';

const SONGS = [
    {
        url: 'midi/fastway.mid',
        name: "Rise of the Triad - Goin' down the fast way - Lee Jackson"
    },
    {
        url: 'midi/runlike.mid',
        name: 'Rise of the Triad - Run like Smeg - Lee Jackson'
    },
    {
        url: 'midi/excalibr.mid',
        name: 'Rise of the Triad - Excalibur - Bobby Prince'
    },
    {
        url: 'midi/cccool.mid',
        name: 'Rise of the Triad - CCCool - Bobby Prince'
    },
    {
        url: 'midi/bunny.mid',
        name: 'Doom - End music - Bobby Prince'
    },
    {
        url: 'midi/e1m9.mid',
        name: 'Doom - Hiding the secrets - Bobby Prince'
    },
    {
        url: 'midi/e2m1.mid',
        name: 'Doom - I sawed the demons - Bobby Prince'
    },
    {
        url: 'midi/dm2ttl.mid',
        name: 'Doom II - Title - Bobby Prince'
    },
    {
        url: 'midi/d_runnin.mid',
        name: 'Doom II - Running from evil - Bobby Prince'
    },
    {
        url: 'midi/d_messag.mid',
        name: 'Doom II - Message for the Archvile - Bobby Prince'
    },
    {
        url: 'midi/grabbag.mid',
        name: 'Duke Nukem 3D - Grabbag - Lee Jackson'
    },
    {
        url: 'midi/stalker.mid',
        name: 'Duke Nukem 3D - Stalker - Lee Jackson'
    },
    {
        url: 'midi/fatcmdr.mid',
        name: 'Duke Nukem 3D - Going after the fat commander - Bobby Prince'
    },
    {
        url: 'midi/invader.mid',
        name: 'Duke Nukem 3D - Invader - Bobby Prince'
    },
    {
        url: 'midi/make-it-tighter.mid',
        name: 'Commander Keen - Make it tighter - Bobby Prince'
    },
    {
        url: 'midi/alienate.mid',
        name: 'Commander Keen - Aliens ate my babysitter - Bobby Prince'
    },
    {
        url: 'midi/sphereful.mid',
        name:
            'Commander Keen - Be Very Sphereful With My Diamonds - Bobby Prince'
    },
    {
        url: 'midi/veggies.mid',
        name:
            "Commander Keen - You've got to eat your vegetables - Bobby Prince"
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

    // mount
    useEffect(() => {
        if (!midiPlayer) {
            const eventLogger = payload => {
                console.log(payload);
                setCurrentSongState(payload.event);
                setCurrentSongTime(payload.time || 0);

                if (payload.event === MIDI_ERROR) {
                    console.error(payload.message);
                    console.error(payload.error);
                }

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

            setMidiPlayer(
                new MidiPlayer({
                    eventLogger,
                    patchUrl: 'patches/'
                })
            );
        }
    }, []);

    // unmount
    useEffect(() => {
        if (midiPlayer) {
            return () => {
                midiPlayer.stop();
            };
        }
    }, [midiPlayer]);

    return (
        <Container>
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
        </Container>
    );
};

const Container = styled.div`
    padding: 5px;
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

export default Player;
