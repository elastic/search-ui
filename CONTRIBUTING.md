# Search UI Contributor's Guide

Thank you for your interest in contributing to search-ui!

How to build and contribute to Search UI.

### Requirements

Node: 8.10
NPM: 6.4

### Mono-repo explanation

This repository is maintained as a Monorepo using [Lerna](https://lernajs.io/).

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

From the root level of this repository, run the following commands in order:

```shell
# Install top level depenedencies at the root of the project
npm install

# Install dependencies in the /packages directory
(cd packages && npm install)

# Install all dependencies for the individual packages
npm run bootstrap
```

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

### Publishing

Publish new version
(Example, publish 0.6.0)

1. Run `npx lerna changed` to see which projects will be published.
2. Update `CHANGELOG` files to include version `v0.6.0` for the projects that will be published.
   NOTE: Lerna does NOT update `package-lock.json` file, so at this point you'll have
   to manually edit the `package-lock.json` for each updated package to update
   `0.5.0` to `0.6.0` at the top of the file.
3. Run `npx lerna version 0.6.0 --exact`.
4. Verify correct tags and commits have been created.
5. Run `nvm use` to make sure you are running the correct version of node, and verify that `npm build` runs without error before publishing.
6. Run `npx lerna publish from-git`.
7. Verify `0.6.0` has been published to npm.
8. Create new version branch `git checkout -b v0.6` and push to `origin`.
9. If this is the latest version of the library, update the `stable` branch to this version `git rebase v0.6` and force push to `origin`.
10. Create release in Github.

Publish patch version
(Example, publish 0.6.1)

1. PR changes into `v0.6` branch.
2. Run `npx lerna changed` to see which projects will be published.
3. Update `CHANGELOG` files to include version `0.6.1` for the projects that will be published.
   NOTE: Lerna does NOT update `package-lock.json` file, so at this point you'll have
   to manually edit the `package-lock.json` for each updated package to update
   `0.6.0` to `0.6.1` at the top of the file.
4. Run `npx lerna version 0.6.1 --exact`.
5. Verify correct tags and commits have been created.
6. Run `nvm use` to make sure you are running the correct version of node, and verify that `npm build` runs without error before publishing.
7. Run `npx lerna publish from-git`.
8. Verify `0.6.1` has been published to npm.
9. Make sure changed are also committed back to master.
10. If this is the latest version of the library, update the `stable` branch to this version `git rebase v0.6.1` and force push to `origin`.
11. Create release in Github.

### Canary releases for testing

It can often be useful to publish a change and test it before doing a real live publish. For instance, it can be useful to publish something from a PR branch and test it with an actual install. Use lerna's [canary](https://github.com/lerna/lerna/tree/master/commands/publish#--canary)
option for this.

1. Check out pr branch
2. `npx lerna publish --canary`
3. In project you'll need to install all dependencies explicitly with the canary tag from npm:

   ```
   npm install --save @elastic/react-search-ui@canary @elastic/search-ui-app-search-connector@canary @elastic/react-search-ui-views@canary search-ui-views@canary
   ```

Publishing with canary generates a unique new version number, publishes it to npm, then updates the `canary` tag in npm to point to that new version.
