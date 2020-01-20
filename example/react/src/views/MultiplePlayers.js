import React from 'react';
import styled from 'styled-components';
import Wrapper from '../components/Wrapper';
import Player from '../components/Player';

const MultiplePlayers = () => {
    return (
        <Wrapper>
            <FlexWrapper>
                <div>
                    <PlayerHeading>Player #1</PlayerHeading>
                    <Player />
                </div>
                <div>
                    <PlayerHeading>Player #2</PlayerHeading>
                    <Player />
                </div>
            </FlexWrapper>
        </Wrapper>
    );
};

const FlexWrapper = styled.div`
    display: flex;
`;

const PlayerHeading = styled.h2`
    text-align: center;
    margin: 0;
`;

export default MultiplePlayers;
