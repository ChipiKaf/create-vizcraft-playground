# VizCraft Playground

Explore interactive visualizations.

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Personalise

Run the init wizard to set your playground's title, subtitle, and accent colour:

```bash
npm run init
```

Or edit `src/playground.config.ts` directly.

## Adding a Plugin

Generate a new plugin with the scaffolding tool:

```bash
npm run generate <plugin-name> --category "Category Name"
```

For example:

```bash
npm run generate supply-demand --category "Microeconomics"
```

This creates `src/plugins/<plugin-name>/` and wires it into the registry automatically. If the category doesn't exist yet, it will be created.

### Generate a sandbox plugin

Use the sandbox option when you want dynamic infrastructure toggles and adaptive step flows:

```bash
npm run generate cloud-lab --category "Systems" --sandbox
```

The generator includes sandbox-aware defaults and structure for component toggles, step mapping, and interaction-focused scenes.

### Plugin structure

| File | Purpose |
|------|---------|
| `index.ts` | Plugin registration (id, name, steps, reducer) |
| `*Slice.ts` | Redux Toolkit slice for local state |
| `use*Animation.ts` | Step orchestration & signal animation |
| `main.tsx` | React component using plugin-kit |
| `main.scss` | Plugin-specific styles |
| `concepts.tsx` | Clickable info-pill definitions |

See the **hello-world** plugin for a minimal working example.

## Tech Stack

- [React](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [vizcraft](https://www.npmjs.com/package/vizcraft) (SVG visualization engine)
- SCSS
