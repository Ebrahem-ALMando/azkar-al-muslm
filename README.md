# azkar-al-muslm

**أذكار المسلم** — رفيق سطح المكتب اليومي للذكر والطمأنينة.

## Technical identity

| Field | Value |
| --- | --- |
| Package name | `azkar-al-muslm` |
| User-facing name | أذكار المسلم |
| Stack (current) | Next.js 16 · React 19 · TypeScript · Tailwind CSS 4 |
| Long-term target | React + TypeScript + Vite + Electron |

## Scripts

```bash
pnpm install
pnpm dev
pnpm build
pnpm start
```

## Phase 01 focus

- Technical naming standardization
- Semantic design tokens and theme contrast fixes
- Lightweight CSS motion system
- Homepage visual redesign with contextual hero carousel

Religious JSON content under `public/data/` is preserved as-source.

## Architecture notes

Current stack is a **single-route Next.js App Router client page** (`app/page.tsx`) with views switched in local state — not a multi-route app. Features present: home, adhkar, Beautiful Names (from `public/data/names-of-allah.json`), sakinah, tasbeeh, nafahat, settings/themes, onboarding.

### Migration recommendation (later phase)

Stay on Next.js for content/UI iteration. When Electron begins:

1. Extract UI into a framework-agnostic `src/` package (components, theme tokens, JSON loaders).
2. Introduce Vite + React + TypeScript as the desktop renderer entry.
3. Keep Next only if a web build remains useful; otherwise retire App Router.
4. Move prayer times off hardcoded demo values to a local calculation module before shipping desktop.

Do **not** migrate mid-redesign — Phase 01 intentionally stays on Next.js.

## Windows install note

This repo uses `.npmrc` with `node-linker=hoisted` to avoid pnpm symlink permission failures on Windows without Developer Mode.