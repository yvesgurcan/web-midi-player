import React, { Fragment, useState } from 'react';
import styled from 'styled-components';

export default ({ handleAddSong }) => {
    const [songUrl, setSongUrl] = useState('');
    const [songName, setSongName] = useState('');

    return (
        <Fragment>
            <Heading>Add MIDI</Heading>
            <Form
                onSubmit={event => {
                    event.preventDefault();
                    handleAddSong({ url: songUrl, name: songName });
                }}
            >
                <Label>
                    URL:
                    <TextInput
                        placeholder="Enter the URL of a MIDI file."
                        value={songUrl}
                        onChange={event => setSongUrl(event.target.value)}
                    />
                </Label>
                <Label>
                    Name:
                    <TextInput
                        placeholder="Enter a name for your MIDI."
                        value={songName}
                        onChange={event => setSongName(event.target.value)}
                    />
                </Label>
                <AddButtonContainer>
                    <AddButton>Add</AddButton>
                </AddButtonContainer>
            </Form>
        </Fragment>
    );
};

const Heading = styled.h2`
    text-align: center;
    margin: 0;
`;

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
    min-width: 215px;
`;

const AddButtonContainer = styled.div`
    display: flex;
    justify-content: center;
    align-self: flex-end;
`;

const AddButton = styled.button`
    margin-top: 10px;
`;

const Label = styled.label`
    display: flex;
    flex-wrap: wrap;
    flex-direction: column;
    margin-top: 10px;
`;
