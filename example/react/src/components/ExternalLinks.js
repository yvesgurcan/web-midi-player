import React from 'react';
import styled from 'styled-components';

const NPM_PACKAGE = 'https://npmjs.com/package/web-midi-player';
const GITHUB_REPO = 'https://github.com/yvesgurcan/web-midi-player';
const DOCS = 'https://midi.yvesgurcan.com/doc';
const README = 'https://midi.yvesgurcan.com/';

const ExternalLinks = () => {
    return (
        <Help>
            <Link href={NPM_PACKAGE}>Package</Link>
            <Link href={GITHUB_REPO}>Repository</Link>
            <Link href={DOCS}>Documentation</Link>
            <Link href={README}>Readme</Link>
        </Help>
    );
};

const Help = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
`;

const Link = styled.a.attrs({ target: '_blank', rel: 'noopener' })`
    display: block;
    color: white;
    margin: 7px;
    text-align: center;
`;

export default ExternalLinks;
