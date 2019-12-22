import React from 'react';
import styled from 'styled-components';

const NPM_PACKAGE = 'https://npmjs.com/package/web-midi-player';
const GITHUB_REPO = 'https://github.com/yvesgurcan/web-midi-player';
const DOCS = 'https://midi.yvesgurcan.com/docs';
const README = 'https://midi.yvesgurcan.com/';

const ExternalLinks = () => {
    return (
        <Help>
            <Link href={NPM_PACKAGE} target="_blank" noopener noreferrer>
                Package
            </Link>
            <Link href={GITHUB_REPO} target="_blank" noopener noreferrer>
                Repository
            </Link>

            <Link href={DOCS} target="_blank" noopener noreferrer>
                Documentation
            </Link>
            <Link href={README} target="_blank" noopener noreferrer>
                Readme
            </Link>
        </Help>
    );
};

const Help = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
`;

const Link = styled.a`
    display: block;
    color: white;
    margin: 7px;
    text-align: center;
`;

export default ExternalLinks;
