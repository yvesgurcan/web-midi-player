[![code triage](https://www.codetriage.com/yvesgurcan/web-midi-player/badges/users.svg)](https://www.codetriage.com/yvesgurcan/web-midi-player)
[![npm version](https://badge.fury.io/js/web-midi-player.svg)](https://badge.fury.io/js/web-midi-player)
[![build status](https://github.com/yvesgurcan/web-midi-player/workflows/Build/badge.svg)](https://github.com/yvesgurcan/web-midi-player/actions?query=workflow%3ABuild)
[![publish status](https://github.com/yvesgurcan/web-midi-player/workflows/Publish/badge.svg)](https://github.com/yvesgurcan/web-midi-player/actions?query=workflow%3APublish)
[![](https://data.jsdelivr.com/v1/package/npm/web-midi-player/badge?style=rounded)](https://www.jsdelivr.com/package/npm/web-midi-player)

Event-driven JavaScript library to enable MIDI playback in the browser.

-   Check out the [example](https://midi.yvesgurcan.com/example/).
-   See the [NPM package](https://npmjs.com/package/web-midi-player).
-   Read the [API documentation](https://midi.yvesgurcan.com/doc/).
-   Download [instrument patches](https://github.com/yvesgurcan/midi-instrument-patches/releases/latest/download/patches.zip).

## Install

This library can be installed via NPM.

    npm i web-midi-player

Alternatively, you can add this library to your project with a `script` tag.

    <script src="https://cdn.jsdelivr.net/npm/web-midi-player@latest/index.js"></script>

## Getting started

**This package requires MIDI instrument patches in order to play audio.**

By default, the player loads [instrument patches via the jsDeliver CDN](https://www.jsdelivr.com/package/npm/midi-instrument-patches).

    import MidiPlayer from 'web-midi-player';
    const midiPlayer = new MidiPlayer();
    midiPlayer.play({ url: 'song.mid' });

Alternatively, you can [download instrument patches and add them to your project](https://github.com/yvesgurcan/midi-instrument-patches/releases/latest/download/patches.zip). Make sure to provide the path to the uncompressed files when instantiating the MIDI player.

    import MidiPlayer from 'web-midi-player';
    const midiPlayer = new MidiPlayer({ pathUrl: 'public/patches' });
    midiPlayer.play({ url: 'song.mid' });

## Contributing

Something doesn't work? We want to know! Open a [new issue](https://github.com/yvesgurcan/web-midi-player/issues/new).

Want a new feature? Awesome! Open a [pull request](https://github.com/yvesgurcan/web-midi-player/compare).

### Setup

Clone the repository.

    git clone https://github.com/yvesgurcan/web-midi-player

Install dependencies.

    npm i

Start development server.

    npm start

### Before you open a pull request

Following [semantic version guidelines](https://semver.org/), run one of the following scripts depending on the nature of your changes:

-   `npm upgrade:patch`
-   `npm upgrade:minor`
-   `npm upgrade:major`

This will run all the scripts below, which should all execute successfully in order to merge your code changes into the NPM package.

Before bumping the version:

```
    npm run lint
    npm run test
    npm run build
    cd example && npm run build
```

After bumping the version:

```
    npm run docs
    npm run commit:build
```

### Continuous integration / Continuous development

This repository uses GitHub Actions to automate certain tasks such as publishing to NPM and running tests.

The list of workflows used for this project can be found [./github/workflows](here):

-   Builds are created and checked when you open pull requests into `master`.
-   Merging pull requests into `master` triggers a release on NPM.

Need help to create new workflows? Checkout out [workflow syntax help](https://help.github.com/en/actions/automating-your-workflow-with-github-actions/workflow-syntax-for-github-actions) and [events which trigger workflows](https://help.github.com/en/actions/automating-your-workflow-with-github-actions/events-that-trigger-workflows#webhook-events).

## Misc

This libraries relies on code generated thanks to [Emscripten](https://github.com/emscripten-core/emscripten).
