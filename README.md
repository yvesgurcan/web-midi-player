[![Open Source Helpers](https://www.codetriage.com/yvesgurcan/web-midi-player/badges/users.svg)](https://www.codetriage.com/yvesgurcan/web-midi-player)

This event-driven library enables MIDI playback in the browser.

## Install

This library can be installed via NPM.

```
npm i web-midi-player
```

Alternatively, this NPM package is hosted for free by [jsDeliver](https://www.jsdelivr.com/). You can add this library via the jsDeliver CDN:

```
<script src="https://cdn.jsdelivr.net/npm/web-midi-player@latest/"></script>
```

## Usage

```
import MidiPlayer from 'web-midi-player';

const midiPlayer = new MidiPlayer();

midiPlayer.play('song.midi');
```

## API

## Events

## How it works

## Contribute

Something doesn't work? We want to know! Open a [new issue](https://github.com/yvesgurcan/web-midi-player/issues/new).

Want a new feature? Awesome! Open a [pull request](https://github.com/yvesgurcan/web-midi-player/compare).

## Develop

### Setup

Clone the repository.
```
git clone https://github.com/yvesgurcan/web-midi-player
```

Install dependencies.

```
npm i
```

Start development server.
```
npm start
```

### Before committing your code

Create new build
```
npm run build
```

Run linter.
```
npm run lint
```

Execute tests.
```
npm run test
```
