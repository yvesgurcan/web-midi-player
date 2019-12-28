import React from 'react';
import styled from 'styled-components';
import { NavLink } from 'react-router-dom';
import { withRouter } from 'react-router';

function isActive(match, propsMatch, name) {
    return (
        // that's a match
        (match && match.url) ||
        // fallback to the single player example
        (!match && name === 'single' && propsMatch.path === '/')
    );
}

const Nav = props => {
    return (
        <Help>
            <Link
                exact
                isActive={match => isActive(match, props.match, 'single')}
                to="/"
            >
                Single Player
            </Link>
            <Link
                strict
                isActive={match => isActive(match, props.match, 'multi')}
                to="/multi"
            >
                Multiple Players
            </Link>
        </Help>
    );
};

const Help = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
`;

const Link = styled(NavLink)`
    display: block;
    color: white;
    margin: 7px;
    text-align: center;

    &.active {
        font-weight: bold;
    }
`;

export default withRouter(Nav);
