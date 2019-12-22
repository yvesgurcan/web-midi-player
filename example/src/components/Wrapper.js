import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import MidiPlayer from 'web-midi-player';

const NPM_PACKAGE = 'https://npmjs.com/package/web-midi-player';
const GITHUB_REPO = 'https://github.com/yvesgurcan/web-midi-player';
const DOCS = 'https://midi.yvesgurcan.com/docs';
const README = 'https://midi.yvesgurcan.com/';

const Wrapper = ({ children }) => {
    return (
        <View>
            <Container>
                <Heading>web-midi-player</Heading>
                <Help>
                    <Link
                        href={NPM_PACKAGE}
                        target="_blank"
                        noopener
                        noreferrer
                    >
                        Package
                    </Link>
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
                {children}
            </Container>
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

const Container = styled.div`
    background: rgb(125, 125, 125);
    color: white;
    padding: 20px;
    border-radius: 10px;
    min-height: 75px;
`;

const Heading = styled.h1`
    text-align: center;
    margin: 0;
`;

const Help = styled.div`
    display: flex;
    flex-wrap: wrap;
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

export default Wrapper;
