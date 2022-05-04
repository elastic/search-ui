# Search UI Contributor's Guide

Thank you for your interest in contributing to Search UI!

Before you begin, a couple notes...

- Prior to opening a pull request, please:
  - Create an issue to [discuss the scope of your proposal](https://github.com/elastic/search-ui/issues).
  - Sign the [Contributor License Agreement](https://www.elastic.co/contributor-agreement/). We are not asking you to assign copyright to us, but to give us the right to distribute your code without restriction. We ask this of all contributors in order to assure our users of the origin and continuing existence of the code. You only need to sign the CLA once.
- Please write simple code and concise documentation, when appropriate.

## Running Search UI

### Codebase overview

This repository is maintained as a Monorepo using [Lerna](https://github.com/lerna/lerna).

Lerna configuration is contained in `lerna.json`.

- `/packages` - Contains publishable Search UI npm packages.
- `/examples` - Contains non-publishable examples of Search UI usage. They are declared
  as "packages" in `lerna.json` so that yarn workspaces will automatically wire up the
  examples to local dependencies.

Dependencies are declared in a package.json hierarchy.

- `/package.json` - Dependencies for repo tooling, like `husky` and `lerna`.
  can be declared here.
- /`packages/{package_name}/package.json` - Package specific dependencies.

### Requirements

- Node: ^16.14.1
- Yarn: ^1.2
- OS: Unix/Linux or Windows Subsystem for Linux

### Installing dependencies

From the root level of this repository:

```shell
yarn
```

Behind the scenes, yarn will installs dependencies in the root folder, and for each lerna package and example repo. Lerna is configured to use yarn workspaces which will hoist shared dependencies in the packages into the root.

### Building

For all packages, run from repository root. For single package, run from
package folder.

```shell
# Build once
yarn build

# Watch for changes and re-build
yarn watch
```

### Testing

For all packages, run from repository root. For single package, run from
package folder.

```shell
# Test once
yarn test

# Watch for changes and re-run
yarn test -- --watch
```

### Sandbox

The [sandbox app](examples/sandbox/README.md) is available to demo usage and act as a development aid.

It is wired up to use the local source of the Search UI libraries as dependencies via Lerna.
This means as you update library code you can see it updated live in the sandbox app.

To run it locally:

```shell
# From the repository root
yarn watch

# In a separate terminal
cd examples/sandbox
yarn start
```

To configure the sandbox to use your own data, simply create a `.env` file
in the sandbox folder, and configure the properties of the `connector` you're using.

For example, if you're using App Search, put this into your `.env` file:

```
REACT_APP_SEARCH_ENGINE_NAME=<PUT YOUR ENGINE NAME HERE>
REACT_APP_SEARCH_KEY=<PUT YOUR SEARCH KEY HERE>
REACT_APP_SEARCH_ENDPOINT_BASE=<PUT AN ENDPOINT BASE HERE>
```

### Editor Setup

#### VSCode

We recommend using the ESLint plugin with the following settings:

```json
  "editor.formatOnSave": true,
  "eslint.enable": true
```

NOTE: We enable `formatOnSave` so that `/examples` are formatted automatically. `eslint --fix` would only apply to code under `/packages`

## Branching Strategy

Our `master` branch holds the latest development code for the next release. If the next release will be a minor release, the expecation is that no breaking changes will be in `master`. If a change would be breaking, we need to put it behind a feature flag, or make it an opt-in change. We will only merge breaking PRs when we are ready to start working on the next major.

All PRs should be created from a fork, to keep a clean set of branches on `origin`.
