[![code triage](https://www.codetriage.com/yvesgurcan/web-midi-player/badges/users.svg)](https://www.codetriage.com/yvesgurcan/web-midi-player)
[![npm version](https://badge.fury.io/js/web-midi-player.svg)](https://badge.fury.io/js/web-midi-player)
[![build status](https://github.com/yvesgurcan/web-midi-player/workflows/Build/badge.svg)](https://github.com/yvesgurcan/web-midi-player/actions?query=workflow%3ABuild)
[![release status](https://github.com/yvesgurcan/web-midi-player/workflows/Release/badge.svg)](https://github.com/yvesgurcan/web-midi-player/actions?query=workflow%3ARelease)

Event-driven JavaScript library to enable MIDI playback in the browser.

-   Check out the [example](https://midi.yvesgurcan.com/example/).
-   See the [NPM package](https://npmjs.com/package/web-midi-player).
-   Read the [API documentation](https://midi.yvesgurcan.com/doc/).

## Install

This library can be installed via NPM.

    npm i web-midi-player

Alternatively, this NPM package is hosted for free by [jsDeliver](https://www.jsdelivr.com/). You can add this library via the jsDeliver CDN:

    <script src="https://cdn.jsdelivr.net/npm/web-midi-player@latest/"></script>

## Getting started

    import MidiPlayer from 'web-midi-player';

    const midiPlayer = new MidiPlayer();

    midiPlayer.play({ url: 'song.mid' });

## Contribute

Something doesn't work? We want to know! Open a [new issue](https://github.com/yvesgurcan/web-midi-player/issues/new).

Want a new feature? Awesome! Open a [pull request](https://github.com/yvesgurcan/web-midi-player/compare).

### Setup

Clone the repository.

    git clone https://github.com/yvesgurcan/web-midi-player

Install dependencies.

    npm i

Start development server.

    npm start

### Before you commit your code

Run linter.

    npm run lint

Execute tests.

    npm run test

Create new build.

    npm run build

Update documentation.

    npm run docs

### GitHub Actions

This repository uses GitHub Actions to automate certain continous integration / continuous development tasks such as publishing to NPM and running tests.

The list of workflows used for this project can be found [./github/workflows](here).

Need help to create new workflows? Checkout out [workflow syntax help](https://help.github.com/en/actions/automating-your-workflow-with-github-actions/workflow-syntax-for-github-actions) and [events which trigger workflows](https://help.github.com/en/actions/automating-your-workflow-with-github-actions/events-that-trigger-workflows#webhook-events).

## Misc

This libraries relies on code generated thanks to [Emscripten](https://github.com/emscripten-core/emscripten).
