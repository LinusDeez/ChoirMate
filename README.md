# ChoirMate

A web app that helps choir singers practise their part at home.

**Live:** <https://choirmate.linusdietz.workers.dev>

> Early development. ChoirMate is a portfolio project, piloted with my own choir.

## What it does so far

- Opens MusicXML scores (`.mxl` or `.musicxml`) and engraves them in the browser
  with [Verovio](https://www.verovio.org).
- Keeps the page and system breaks of the original edition on fixed A4 pages,
  so "page 2, top right" means the same thing on every screen and on paper.
- Shows as many pages side by side as fit on the screen.
- Turns pages with buttons, the keyboard (Page Up/Down, arrow keys) or a
  Bluetooth page-turner foot pedal.

## Roadmap

1. ~~Show the score~~ ✓
2. Play it back
3. Practise: choose your voice, loop passages, change the tempo
4. Accounts and shared scores for a choir
5. Installable app that works offline (PWA)
6. Pilot with a real choir

## Tech stack

React 19, TypeScript, Vite, Verovio (WebAssembly, running in a Web Worker),
Vitest, deployed on Cloudflare Workers.

## Development

Requires Node.js (version in [`.nvmrc`](.nvmrc)).

```sh
npm ci            # install dependencies
npm run dev       # start the dev server
npm run test:run  # run the tests once
npm run lint      # check the code with ESLint
npm run build     # type-check and build for production
```

| Folder                                      | Contents                                           |
| ------------------------------------------- | -------------------------------------------------- |
| [`src/core`](src/core)                      | Music logic in plain TypeScript, no browser needed |
| [`src/engraving`](src/engraving)            | Verovio in a Web Worker: MusicXML in, SVG out      |
| [`src/audio`](src/audio)                    | Playback (coming in phase 2)                       |
| [`src/ui`](src/ui)                          | React components and hooks                         |
| [`tests/fixtures`](tests/fixtures/musicxml) | Freely licensed test scores and their edge cases   |

## License

ChoirMate is released under the [MIT License](LICENSE).

### Third-party software

ChoirMate bundles [Verovio](https://github.com/rism-digital/verovio)
(© Laurent Pugin and others), which is licensed under the
[GNU Lesser General Public License v3.0](https://www.gnu.org/licenses/lgpl-3.0.html).
Verovio is used unmodified, as published in the npm package
[`verovio`](https://www.npmjs.com/package/verovio); its source code is
available in the repository linked above. To use a different version, change
the `verovio` dependency in [`package.json`](package.json) and rebuild.

### Test scores

The scores in [`tests/fixtures/musicxml`](tests/fixtures/musicxml) come from
the [Choral Public Domain Library](https://www.cpdl.org) and keep their own
licenses, listed in [their README](tests/fixtures/musicxml/README.md).
