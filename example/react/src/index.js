import React from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { HashRouter, Switch, Route } from 'react-router-dom';

import SinglePlayer from './views/SinglePlayer';
import MultiplePlayers from './views/MultiplePlayers';

const Example = () => {
    return (
        <HashRouter>
            <Route
                render={({ location }) => (
                    <Background>
                        <TransitionGroup component={null}>
                            <CSSTransition
                                timeout={400}
                                classNames="page"
                                key={location.pathname}
                            >
                                <PageTransition>
                                    <Switch>
                                        <Route
                                            path="/multi"
                                            component={MultiplePlayers}
                                        />
                                        <Route
                                            path="/"
                                            component={SinglePlayer}
                                        />
                                    </Switch>
                                </PageTransition>
                            </CSSTransition>
                        </TransitionGroup>
                    </Background>
                )}
            />
        </HashRouter>
    );
};

const Background = styled.div`
    background: black;
    margin: -8px;
`;

const PageTransition = styled.div`
    @keyframes fadeIn {
        from {
            opacity: 0;
        }

        to {
            opacity: 1;
        }
    }

    @keyframes fadeOut {
        from {
            opacity: 1;
        }

        to {
            opacity: 0;
        }
    }

    &.page-enter {
        animation: fadeIn 0.2s forwards;
    }

    &.page-exit {
        animation: fadeOut 0.2s forwards;
    }
`;

ReactDOM.render(<Example />, document.getElementById('app'));
