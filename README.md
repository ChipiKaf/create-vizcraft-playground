# create-vizcraft-playground

Scaffold a new [VizCraft](https://www.npmjs.com/package/vizcraft) interactive visualization playground in seconds.

## Usage

```bash
npx create-vizcraft-playground my-playground
```

Or without a project name — the CLI will prompt you:

```bash
npx create-vizcraft-playground
```

The scaffolder will ask for:

- **Project directory name**
- **Playground title** shown on the landing page
- **Subtitle** — one-liner description
- **Accent colour** — hex value for the primary theme colour

Then just install and run:

```bash
cd my-playground
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Re-running the setup wizard

You can re-configure the title, subtitle, and accent colour at any time:

```bash
npm run init
```

This regenerates `src/playground.config.ts`.

## Adding a plugin

Generate a new visualization plugin:

```bash
npm run generate <plugin-name> --category "Category Name"
```

Example:

```bash
npm run generate supply-demand --category "Microeconomics"
```

This creates `src/plugins/<plugin-name>/` and wires it into the registry automatically. See [template/README.md](template/README.md) for full plugin docs.

### Sandbox plugins

Use the `--sandbox` flag to generate an interactive, architecture-builder-style plugin where users can dynamically add and remove components and the scene, steps, and animations all adapt reactively:

```bash
npm run generate cloud-lab --category "Systems" --sandbox
```

A sandbox plugin differs from a standard one in a few key ways:

- **Controls panel** — a `controls.tsx` component rendered in the Shell sidebar lets users toggle infrastructure components on and off.
- **Dynamic steps** — steps are derived from the current component state, so adding a cache or load balancer automatically adds relevant walkthrough steps.
- **Declarative flow engine** — a `flow-engine.ts` file describes all signal animations as data. No imperative per-step animation code; adding a step means adding a config entry.
- **8 files** instead of the standard 6, including `flow-engine.ts` and `controls.tsx`.

Use sandbox plugins when you want an interactive scene where composition affects both the narrative and the visualization.

### Timeline plugins

Use the `--timeline` flag to generate a progressive-reveal timeline plugin with animated nodes, a colored progress bar, auto-pan, and declarative steps generated from a data array:

```bash
npm run generate historical-events --category "History" --timeline
```

A timeline plugin differs from the standard one in a few key ways:

- **Declarative flow engine** — a `flow-engine.ts` file defines steps as data. Per-item steps are auto-generated from the items array so adding an item automatically adds a step.
- **Data file** — a `data.ts` file contains the timeline items, category colors, era ranges, and connection definitions.
- **Progressive reveal** — items light up one-by-one with a 3-state system (reached / active / upcoming) and a colored progress bar tracks progress.
- **Animated nodes** — the active node rises up with an `animateTo()` entrance and the camera auto-pans via `zoomToNode()`.
- **8 files** instead of the standard 6, including `flow-engine.ts` and `data.ts`.

Use timeline plugins when you want a chronological walkthrough with per-item detail cards and connection overlays.

## Requirements

- Node.js 20+

3. Add a short summary sentence.

## Template docs

Scaffolded playground usage and plugin-generation docs are in template/README.md.
