import React, { useState } from 'react';
import styled from 'styled-components';

export default ({ handleAddSong }) => {
    const [songUrl, setSongUrl] = useState('');
    const [songName, setSongName] = useState('');

    return (
        <Form
            onSubmit={event => {
                event.preventDefault();
                handleAddSong({ url: songUrl, name: songName });
            }}
        >
            <TextInput
                placeholder="Enter the URL of a MIDI file."
                value={songUrl}
                onChange={event => setSongUrl(event.target.value)}
            />
            <TextInput
                placeholder="Enter a name for your MIDI."
                value={songName}
                onChange={event => setSongName(event.target.value)}
            />
            <AddButtonContainer>
                <AddButton>Add MIDI</AddButton>
            </AddButtonContainer>
        </Form>
    );
};

const Form = styled.form`
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    margin-top: 5px;
    margin-bottom: 5px;
`;
const TextInput = styled.input`
    padding: 2px;
    margin-right: 10px;
    margin-top: 10px;
    min-width: 215px;
`;

const AddButtonContainer = styled.div`
    display: flex;
    justify-content: center;
    margin-top: 10px;
`;

const AddButton = styled.button`
    margin: auto;
`;
