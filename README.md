# Evan Rasheed — Character Profile

Evan Rasheed’s interactive developer portfolio. The side navigation opens Overview, Work, About, and Contact without leaving the character screen. Project details open in a dialog, and the profile remains accessible when WebGL is unavailable.

## Run locally

Requires Node.js and npm. From the repository root:

```sh
npm ci
npm run dev
```

Open the URL printed by Vite. Build with `npm run build` and serve the built site locally with `npm run preview`.

## Navigation

Choose a side icon to switch sections. On small screens the icons move to the bottom. Open a project in Work to see its details; Escape closes the project dialog or returns from a section to Overview. Direct links use `#world`, `#work`, `#about`, and `#contact`.

Drag the character to rotate and use the mouse wheel to zoom. The pixiv VRM avatar plays a relaxed idle. Overview, Work, About, and Contact each trigger a distinct Overte skeletal clip retargeted to the avatar. Gestures crossfade back into idle, and reduced-motion mode holds a resting pose.

The earlier explorable-world version is preserved in the local Git recovery commits. It is not the current interface.

## Checks

```sh
npm run lint
npm test
npm run build
npx playwright install chromium
npm run test:e2e
```

The browser tests start Vite on port 4173. Set `PLAYWRIGHT_CHROMIUM_EXECUTABLE` to a local Chrome executable to use it instead of Playwright-managed Chromium. See `ASSETS.md` for model provenance and usage limitations.
