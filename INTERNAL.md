The content in this file links to Elastic internal resources and is mainly meant for core maintainers within Elastic. For a more general guide for developing, please consult CONTRIBUTING.md.

# Running docs locally

The Search UI docs are built using an internal library (which hopefully moves into the open soon!).

An overview of the syntax used can be found here: https://github.com/elastic/docsmobile/blob/main/doc-site/docs/docs_syntax.mdx.

1. Clone https://github.com/elastic/docs.elastic.co next to search-ui repo
2. Create **content-dev.js** by moving into the `docs.elastic.co` folder and copying **content.js**: `cp config/content.js config/content-dev.js`
3. Edit your **content-dev.js** file so that:
   ```
   sources: [
     {
       type: 'github',
       location: 'elastic/wordlake',
     },
     {
       type: 'file',
       location: '../../search-ui'
     }
   ],
   ```
4. Run `yarn`, then `yarn init-docs`, then `yarn dev`.
5. After the initial setup is done, simply use `yarn docs-start` from the search-ui root.

# Publishing

Releases should be performed directly in main (or a minor branch for patches), following the [Publishing guide](./PUBLISHING.md).

We will create branches for all minor releases.

> Because all examples are declared as "private", when running lerna commands other than bootstrap, (like `publish` and `test`), the `--no-private` flag should be appended.

## Publish a new major or minor from main

(Example, publishing 0.6.0)

1. Run `npx lerna version 0.6.0 --force-publish --exact`.
1. Verify the `0.6.0` tag was created as well as a "Release 0.6.0" commit.
1. Run `nvm use` to make sure you are running the correct version of node, and verify that `npm run build` runs without error before publishing.
1. Run `npx lerna publish from-package`.
1. Verify the `0.6.0` has been published to npm.
1. Verify that the `v0.6.0` tag and commit has been pushed to `main` on `origin`.
1. Create new version branch, `0.6` from the `0.6.0` tag and push to `origin`.
1. Create a release in Github.
1. Close the release Milestone in Github.
1. Verify the demo on Codesandbox is functioning: https://codesandbox.io/s/github/elastic/search-ui/tree/main/examples/sandbox

## Publish a patch

(Example, publish 0.6.1)

1. Create a `0.6` branch from the `0.6.0` tag, if one does not already exist.
1. Run `npx lerna version 0.6.1 --force-publish --exact`.
1. Verify the `v0.6.1` tag was created as well as a "Release 0.6.1" commit.
1. Run `nvm use` to make sure you are running the correct version of node, and verify that `npm run build` runs without error before publishing.
1. Run `npx lerna publish from-package`.
1. Verify the `0.6.1` has been published to npm.
1. Verify that the `0.6.1` tag and commit has been pushed to `main` on `origin`.
1. Cherry-pick the changes forward to subsequent minor releases and main, and repeat the process.
1. Create a release in Github.
1. Close the release Milestone in Github.
1. Verify the demo on Codesandbox is functioning: https://codesandbox.io/s/github/elastic/search-ui/tree/main/examples/sandbox

## Canary releases for testing

It can often be useful to publish a change and test it before doing a real live publish. For instance, it can be useful to publish something from a PR branch and test it with an actual install. Use lerna's [canary](https://github.com/lerna/lerna/tree/master/commands/publish#--canary)
option for this.

1. Check out pr branch
1. `npx lerna publish --force-publish --canary --preid canary [patch|minor|major]` - Publishing with canary generates a unique new version number, publishes it to npm, then updates the `canary` tag in npm to point to that new version.
1. In project you'll need to install all dependencies explicitly with the canary tag from npm:

   ```
   npm install --save @elastic/react-search-ui@canary @elastic/search-ui-app-search-connector@canary @elastic/react-search-ui-views@canary search-ui-views@canary
   ```

1. To check your changes, simply push them to the `canary` branch, then visit https://codesandbox.io/s/github/elastic/search-ui/tree/canary/examples/sandbox

## Release candidates

When pushing release candidates, the following lerna commands can be useful:

```
# Create a pre-release version, like 1.0.0-rc.0
npx lerna version [premajor | preminor | prepatch | prerelease] --exact --force-publish --no-private  --preid rc
# Publish 1.0.0-rc.0 and update the `next` to point to this version
npx lerna publish from-package --force-publish --dist-tag next
```

## Testing Canary build and Release Pre-releases

We have a number of demos available that you can use to do quick smoke testing of releases in various
stacks:

- https://codesandbox.io/s/search-ui-gatsby-example-u041m
- https://codesandbox.io/s/search-ui-next-js-example-tb05u
- https://codesandbox.io/s/search-ui-national-parks-example-kdyms

## Demo (uses code from main branch)

- https://codesandbox.io/s/github/elastic/search-ui/tree/main/examples/sandbox
