import React from 'react';
import styled from 'styled-components';
import Nav from './Nav';
import ExternalLinks from './ExternalLinks';

const Wrapper = ({ children }) => {
    return (
        <View>
            <Container>
                <Heading>web-midi-player</Heading>
                <AllTheLinks>
                    <Nav />
                    <ExternalLinks />
                </AllTheLinks>
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
    transition: all 1s;
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

const AllTheLinks = styled.div`
    max-width: 335px;
    margin: auto;
    margin-bottom: 15px;
`;

export default Wrapper;
