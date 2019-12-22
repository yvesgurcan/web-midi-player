import React from 'react';
import styled from 'styled-components';
import Wrapper from '../components/Wrapper';
import Player from '../components/Player';

const MultiplePlayers = () => {
    return (
        <Wrapper>
            <PlayerHeading>Player #1</PlayerHeading>
            <Player />
            <PlayerHeading>Player #2</PlayerHeading>
            <Player />
        </Wrapper>
    );
};

const PlayerHeading = styled.h2`
    text-align: center;
`;

export default MultiplePlayers;
