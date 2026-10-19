# Sai Teja Dusari — Interactive 3D Portfolio

React + Vite + Three.js. The opening interaction is inspired by
[mildsugardesign.jp](https://mildsugardesign.jp/): an animated illustrated character,
hover-only Hey, a turn, stand and Hello wave, then the original pocket pose. The rest has five named sections:
**About, Skills, Projects, Experience, and Contact**.

## Run

Requires Node.js 22+ and npm.

```sh
npm ci
npm run dev
npm test
npm run build
```

The local preview is `http://localhost:5173`. The static production build is in
`dist/`. Hash routes support GitHub Pages and other static hosting. The deploy
command is available but has not been run.

## Interaction

The opening animates the user's complete illustrated character in a live 3D
room. The same face, swept black hair, black blazer, white shirt, navy trousers
and white sneakers are retained throughout the illustrated pose sequence.
Desktop hover reveals Hey; clicking or pressing Enter turns him toward you,
stands him up, waves Hello, then moves both hands into his trouser pockets.
On the first visit, a warm translucent welcome screen shows a rotating circular
invitation and “Don’t be shy. Feel free to say ‘Hey!’”. It dismisses after a short
introduction or immediately when clicked; replay keeps it dismissed.
The completed pose uses the original full-body PNG itself, unchanged.
Touch devices have a Tap to say hey button. Motion vectors interpolate the drawings
continuously; the chair moves toward the open floor before he rises and the camera waits until
he is standing. Replay starts the seated sequence again. This is an animated
illustration in a 3D room; no stock human model or separate face overlay is used.
While seated, the illustrated forearms rest at desktop height with alternating
typing movements, breathing, and gentle head/body sway. The monitor cycles every
eight seconds between code, a training chart and illustrative evaluation results.
Pausing motion freezes the working activity while retaining the hands-on-desk pose.

Get to know me opens a section navigator. Scroll, swipe vertically, use arrow keys,
or choose a named section. Each section has animated artwork. About includes the
illustrated character portrait and education; Skills contains the toolkit; Projects holds
the two applications and two research projects; Experience covers Starr Insurance
and research; Contact has the original email and social links.

The global orange menu links directly to each section and the resume. The menu
traps keyboard focus and closes with Escape. Pause animations is available in the
menu and page footer; the preference is saved locally and respects OS reduced
motion. Offscreen/hidden scenes suspend their rendering. WebGL failure preserves
the introduction and navigation through text/symbol fallbacks.

## Source map

- `src/data.js`: resume content, exact project/research URLs and social links.
- `src/portfolio/content.js`: section/project definitions and routes.
- `src/portfolio/Studio.jsx`: 3D intro lifecycle, greeting, hover, replay.
- `src/scene/illustratedStudio.js`: live room, camera, greeting, and hover.
- `src/scene/illustrationActor.js`: full-body illustrated animation and original terminal pose.
- `src/portfolio/characterSequence.js`: turn, stand, hello, pockets and replay timing.
- `src/portfolio/CharacterArt.jsx`: supplied illustration in the About artwork.
- `src/scene/createEmblem.js`: animated 3D symbols for sections and projects.
- `src/portfolio/Gallery.jsx`: full-screen section navigation.
- `src/portfolio/Details.jsx`: About, Skills, Projects, Experience and project details.
- `src/portfolio/Header.jsx`: accessible expanding menu.
- `src/App.jsx`: hash routing and orange page wipes.
- `src/styles.css`: cream/orange/teal design and responsive layouts.
- `public/images/sai-illustration.png`: supplied character with transparent background.
- `public/images/sai-motion-atlas.png`: matching illustrated motion frames.
- `public/SaiTeja_Dusari_Resume.pdf`: unchanged resume download.

See [`docs/visual-assets.md`](docs/visual-assets.md) for credits and animation details.
Older unimported components are retained in the repository and are not in the build.

## Checks

`npm test` checks named section routes, project links, trackpad momentum, light
swipes, fast reversals, queued input during transitions, illustration deformation, the full turn/stand/hello/pockets sequence,
and reduced motion. `npm run build` checks the production bundle. The trackpad
handler detects renewed acceleration without waiting for a long idle gap, normalizes
wheel units, and delivers a queued intentional gesture after the transition.
Detail pages, including Skills, retain native vertical scrolling.
