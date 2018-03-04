# whenisgucci

Like whenisgood, but gucci.

For CS3141 (Team Software Project) Spring 2018.

## Setup

### Local Development

Install:

- [Node.js][nodejs] 8.x (check version with `node -v`)
- [Yarn][yarn]
- Gulp (install with `yarn global add gulp-cli`)
- [EditorConfig][editorconfig] plugin for your editor/IDE

1. `git clone` the repo
2. `cd` to the root of the repo
3. Run `yarn` to grab dependencies
4. Create the `.env` file in the repo root
5. Run `gulp` to start the Express server and Gulp watch tasks
6. Code away, commit changes, and profit!

### Deploying/Production

Install:

- PM2 (install with `yarn global add pm2`)

1. `git clone` the repo
2. `cd` to the root of the repo
3. Run `yarn` to grab dependencies
4. Run `gulp build --production` to build production-ready assets
5. Run `NODE_ENV=production pm2 start app.js` to start the server with PM2

> **NOTE**: Assets need to be re-built manually after pulling down changes.

## Gulp Tasks

There are several `gulp` tasks that can be useful when developing:

- `serve` spins up a local server (is the `default` task)
  - `--prod/--production` to serve the production assets (mimics production site)
  - `--tunnel` to create a temporary URL via localtunnel.me (to share with someone)
- `build` builds the assets
  - `--prod/--production` builds for production (minify, optimize, etc.)
- `clean` wipes the build directory

[nodejs]: https://nodejs.org/en/
[editorconfig]: http://editorconfig.org/#download
[yarn]: https://yarnpkg.com/en/docs/install
