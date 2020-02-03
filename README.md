[![code triage](https://www.codetriage.com/yvesgurcan/web-midi-player/badges/users.svg)](https://www.codetriage.com/yvesgurcan/web-midi-player)
[![npm version](https://badge.fury.io/js/web-midi-player.svg)](https://badge.fury.io/js/web-midi-player)
[![build status](https://github.com/yvesgurcan/web-midi-player/workflows/Build/badge.svg)](https://github.com/yvesgurcan/web-midi-player/actions?query=workflow%3ABuild)
[![publish status](https://github.com/yvesgurcan/web-midi-player/workflows/Publish/badge.svg)](https://github.com/yvesgurcan/web-midi-player/actions?query=workflow%3APublish)
[![](https://data.jsdelivr.com/v1/package/npm/web-midi-player/badge?style=rounded)](https://www.jsdelivr.com/package/npm/web-midi-player)

Event-driven JavaScript library to enable MIDI playback in the browser.

-   Check out examples [with React](https://midi.yvesgurcan.com/example/react/) and [with vanilla JavaScript](https://midi.yvesgurcan.com/example/javascript/).
-   See the [NPM package](https://npmjs.com/package/web-midi-player).
-   Read the [API documentation](https://midi.yvesgurcan.com/doc/).
-   Look at the [source code](https://github.com/yvesgurcan/web-midi-player).
-   Download [instrument patches](https://github.com/yvesgurcan/midi-instrument-patches/releases/latest/download/patches.zip).
-   Want to help? Solve an [issue](https://github.com/yvesgurcan/web-midi-player/issues).

**We're looking for contributors! Find an issue on our [Kanban board](https://github.com/yvesgurcan/web-midi-player/projects/1) and assign it to yourself.**

## Install

### NPM

This library can be installed via NPM.

    npm i web-midi-player

You can then use ES6 module syntax to load the dependency.

    import MidiPlayer from 'web-midi-player';

Or use the CommonJS module system.

    const MidiPlayer = require('web-midi-player');

### CDN

Alternatively, you can add this library to your project with a `script` tag.

    <script src="https://cdn.jsdelivr.net/npm/web-midi-player@latest/index.js"></script>

The library will be accessible under `window['web-midi-player'].default`.

    <script>
        const { 'web-midi-player': { default: MidiPlayer } } = window;
    </script>

## Getting started

**This package requires MIDI instrument patches compatible with [Timidity](https://sourceforge.net/projects/timidity/) (`.pat` files) in order to play audio.**

By default, the player loads [instrument patches via the jsDeliver CDN](https://www.jsdelivr.com/package/npm/midi-instrument-patches).

    const midiPlayer = new MidiPlayer();
    midiPlayer.play({ url: 'song.mid' });

Alternatively, you can [download instrument patches and add them to your project](https://github.com/yvesgurcan/midi-instrument-patches/releases/latest/download/patches.zip). Make sure to provide the path to the uncompressed files when instantiating the MIDI player.

    const midiPlayer = new MidiPlayer({ patchUrl: 'public/patches/' });
    midiPlayer.play({ url: 'song.mid' });

## Contributing

Make sure to read our [code of conduct](https://github.com/yvesgurcan/web-midi-player/blob/master/CODE_OF_CONDUCT.md) first.

Something doesn't work? We want to know! Create a [new issue](https://github.com/yvesgurcan/web-midi-player/issues/new).

Want a new feature? Awesome! Open a [pull request](https://github.com/yvesgurcan/web-midi-player/compare).

### Setup

Clone the repository.

    git clone https://github.com/yvesgurcan/web-midi-player

Install dependencies.

    npm i

Start development server.

    npm start

### Continuous integration / Continuous development

This repository uses GitHub Actions to automate certain tasks such as creating releases, publishing to NPM, and running tests.

The list of workflows used for this project can be found [here](.github/workflows):

## Related projects

This library was created with the help of:

-   The [libTiMidity](http://libtimidity.sourceforge.net) library.
-   WebAssembly code generated thanks to [Emscripten](https://github.com/emscripten-core/emscripten).
-   Code written for [MIDIjs](http://www.midijs.net/). The source code can be found in the [babelsberg-js](https://github.com/babelsberg/babelsberg-js/tree/master/midijs) project.
-   MIDI instrument patches that can be found in a [separate repository](https://github.com/yvesgurcan/midi-instrument-patches).
