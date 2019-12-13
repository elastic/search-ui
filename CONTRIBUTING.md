# Search UI Contributor's Guide

Thank you for your interest in contributing to search-ui!

How to build and contribute to Search UI.

### Requirements

- Node: 10.16
- NPM: 6.9
- OS: Unix/Linux or Windows Subsystem for Linux

### Mono-repo explanation

This repository is maintained as a Monorepo using [Lerna](https://github.com/lerna/lerna).

Lerna configuration is contained in `lerna.json`.

- `/packages` - Contains publishable search-ui npm packages.
- `/examples` - Contains non-publishable examples of search-ui usage. They are declared
  as "packages" in `lerna.json` so that `npx lerna bootstrap` will automatically wire up the
  examples to local dependencies.

Because all examples are declared as "private", when running lerna commands other than bootstrap, (like `publish` and `test`), the `--no-private` flag should be appended.

Dependencies are declared in a package.json hierarchy.

- `/package.json` - Dependencies for repo tooling, like `husky` and `lerna`.
- `/packages/package.json` - Common dev dependencies for all Search UI npm packages. Any dev Common dev dependencies for al that does not need to be called directly in a package level npm command
  can be declared here.
- /`packages/{package_name}/package.json` - Package specific dependencies.

Note that we do not encourage "hoisting" dependencies through lerna. This WILL
cause the examples applications to error out from dependency version conflicts.

### Installing dependencies

From the root level of this repository:

```shell
npm install
```

Behind the scenes, this installs dependencies in the root folder, in the `packages` folder, and for each lerna package and example repo.

### Building

For all projects, run from project root. For single project, run from
package root.

```shell
# Build
npm run build

# Watch for changes and re-build
npm run watch
```

### Testing

For all projects, run from project root. For single project, run from
package root.

All packages:

```shell
# from project root
npm run test

# Watch for changes and re-run
npm run test -- --watch
```

### Sandbox

The [sandbox](examples/sandbox/README.md) app can be used as a local development aid.

### Branching Strategy

Our `master` branch holds the latest development code for the next release. If the next release will be a minor release, the expecation is that no breaking changes will be in `master`. If a change would be breaking, we need to put it behind a feature flag, or make it an opt-in change. We will only merge breaking PRs when we are ready to start working on the next major.

All PRs should be created from a fork, to keep a clean set of branches on `origin`.

Releases should be performed directly in master (or a minor branch for patches), following the Publishing guide below.

We use a `stable` branch to indicate the latest release code.

We will create branches for all minor releases.

### Publishing

Publish a new version from master
(Example, publishing 0.6.0)

1. Run `npx lerna version 0.6.0 --exact`.
1. Verify the `0.6.0` tag was created as well as a "Release 0.6.0" commit.
1. Run `nvm use` to make sure you are running the correct version of node, and verify that `npm run build` runs without error before publishing.
1. Run `npx lerna publish --force-publish=* from-package`.
1. Verify the `0.6.0` has been published to npm.
1. Verify that the `0.6.0` tag and commit has been pushed to `master` on `origin`.
1. Create new version branch, `0.6` from the `0.6.0` tag and push to `origin`.
1. Update the `stable` branch to this version `git checkout stable && git merge --ff-only master && git push origin`.
1. Create a release in Github.
1. Close the release Milestone in Github.

Publish a patch
(Example, publish 0.6.1)

1. Create a `0.6` branch from the `0.6.0` tag, if one does not already exist.
1. Run `npx lerna version 0.6.1 --exact`.
1. Verify the `0.6.1` tag was created as well as a "Release 0.6.1" commit.
1. Run `nvm use` to make sure you are running the correct version of node, and verify that `npm run build` runs without error before publishing.
1. Run `npx lerna publish --force-publish=* from-package`.
1. Verify the `0.6.1` has been published to npm.
1. Verify that the `0.6.1` tag and commit has been pushed to `master` on `origin`.
1. Cherry-pick the changes forward to subsequent minor releases and master, and repeat the process.
1. Create a release in Github.
1. Close the release Milestone in Github.

### Canary releases for testing

It can often be useful to publish a change and test it before doing a real live publish. For instance, it can be useful to publish something from a PR branch and test it with an actual install. Use lerna's [canary](https://github.com/lerna/lerna/tree/master/commands/publish#--canary)
option for this.

1. Check out pr branch
1. `npx lerna publish --force-publish=* --canary --preid canary [patch|minor|major]` - Publishing with canary generates a unique new version number, publishes it to npm, then updates the `canary` tag in npm to point to that new version.
1. In project you'll need to install all dependencies explicitly with the canary tag from npm:

   ```
   npm install --save @elastic/react-search-ui@canary @elastic/search-ui-app-search-connector@canary @elastic/react-search-ui-views@canary search-ui-views@canary
   ```

1. To Deploy, simply push your changes to the `canary` branch, then visit "https://search-ui-canary.netlify.com/"

### Release candidates

When pushing release candidates, the following lerna commands can be useful:

```
# Create a pre-release version, like 1.0.0-rc.0
npx lerna version prerelease --exact --preid rc
# Publish 1.0.0-rc.0 and update the `next` to point to this version
npx lerna publish from-package --force-publish=* --dist-tag next
```

### Testing Canary build and Release Pre-releases

We have a number of demos available that you can use to do quick smoke testing of releases in various
stacks:

- https://codesandbox.io/s/search-ui-gatsby-example-u041m
- https://codesandbox.io/s/search-ui-next-js-example-tb05u
- https://codesandbox.io/s/search-ui-national-parks-example-kdyms

### Stable demos

- Elastic App Search: https://search-ui-stable.netlify.com/
- Elastic Site Search: https://search-ui-stable-site-search.netlify.com/
- Elasticsearch: https://search-ui-stable-elasticsearch.netlify.com/
