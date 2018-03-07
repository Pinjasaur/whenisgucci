# Contributing

## General

- As detailed in the README, make sure your have [EditorConfig][editorconfig] installed for text editor/IDE.

## Branching Strategy

- **`master`** should be production-ready, stable code.
- **`dev`** is a working-copy of merged-in features. Likely non-stable with bugs.

## Adding a Feature

1. Make sure your copy of `dev` is up to date.
2. Branch off of `dev` into your new feature branch:
  - `git checkout -b feat/<my-feature-name>`
3. Make commits to your new branch. Follow the [Git Guidelines](#git-guidelines).
4. Make a PR to merge back into `dev` when ready.
5. Once merged into `dev` and verified to be stable, `dev` will be merged with `master`.

## Git Guidelines

- Keep commit titles <= 50 characters (verbose and to-the-point).
- Use imperative mood ("implement" instead of "implementing").
- Omit periods in your title.
- If necessary, reference an issue number (e.g. #1).
- If necessary, include extra information in the commit body.

[editorconfig]: http://editorconfig.org/#download
