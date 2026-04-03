# create-vizcraft-playground

Scaffold a new VizCraft interactive visualization playground.

## What this package does

- Creates a ready-to-run VizCraft + React + TypeScript playground.
- Includes plugin scaffolding scripts for linear and sandbox-style visualizations.
- Ships with Changesets + GitHub Actions release automation.

## Requirements

- Node.js 20+
- npm

## Local development

1. Install dependencies:

   npm install

2. Run the package locally (optional):

   node index.js my-playground

## Repository scripts

- npm run changeset: create a changeset entry for release notes and versioning.

## Release flow (Changesets)

This repository uses `.github/workflows/release.yml` to:

- Open a release PR when changesets are present.
- Publish to npm after the release PR is merged.

### One-time repository setup

1. Add an Actions secret named `NPM_TOKEN` with publish access to npm.
2. In GitHub repository settings:
   - Go to Settings -> Actions -> General.
   - Set Workflow permissions to Read and write permissions.
   - Enable Allow GitHub Actions to create and approve pull requests.

If your organization blocks default Actions PR permissions, create a PAT and use a `GH_RELEASE_TOKEN` secret for release jobs.

## Creating a changeset

Interactive:

npm run changeset

Non-interactive (manual file):

1. Create a markdown file in `.changeset/`.
2. Frontmatter format:

   ---
   "create-vizcraft-playground": patch
   ---

3. Add a short summary sentence.

## Template docs

Scaffolded playground usage and plugin-generation docs are in template/README.md.
