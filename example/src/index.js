import React, { useState } from 'react';
import styled from 'styled-components';
import MidiPlayer from 'web-midi-player';

const midiPlayer = new MidiPlayer();

const songs = [
    { url: '/midi/d_runnin.mid', name: 'Running from evil - Bobby Prince' },
    { url: '/midi/fatcmdr.mid', name: 'Going after the fat commander - Bobby Prince' },
    { url: '/midi/veggies.mid', name: 'You\'ve got to eat your vegetables - Bobby Prince' }
];

export default () => {
    const [currentSongIndex, setCurrentSongIndex] = useState(0);
    return (
        <Player>
            <CurrentSong>{songs[currentSongIndex].name}</CurrentSong>
            <Control>
                <div onClick={() => midiPlayer.play({ url: songs[currentSongIndex].url })}>play</div>
                <div onClick={() => midiPlayer.pause()}>pause</div>
                <div onClick={() => midiPlayer.resume()}>resume</div>
                <div onClick={() => midiPlayer.stop()}>stop</div>
                <div onClick={() => {
                    const prevIndex = Math.max(0, currentSongIndex - 1);
                    midiPlayer.play({ url: songs[prevIndex].url })
                    setCurrentSongIndex(prevIndex);
                }>previous</div>
                <div onClick={() => {
                    const nextIndex = Math.min(songs.length - 1, currentSongIndex + 1);
                    midiPlayer.play({ url: songs[nextIndex].url });
                    setCurrentSongIndex(nextIndex);
                }>next</div>
            </Control>
        </Player>
    );
};

const Player = styled.div``'

const CurrentSong = styled.div``;

const Control = styled.div`
    display: flex;
`;
