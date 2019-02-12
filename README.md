<p align="center"><a href="https://circleci.com/gh/elastic/search-ui/tree/master"><img src="https://circleci.com/gh/elastic/search-ui/tree/master.svg?style=svg&circle-token=c637bc2af60035a1f4cb5367071999ced238be76" alt="CircleCI buidl"></a>
<img src="https://img.shields.io/badge/version-beta-red.svg" alt="BETA" /></p>

> Libraries for the fast development of modern, engaging search experiences.

## Contents

- [Getting started](#getting-started-)
- [Developing Search UI](#developing-search-ui)
- [Running tests](#running-tests)
- [FAQ](#faq-)
- [Contribute](#contribute-)
- [License](#license-)

---

## Getting started 🐣

Search UI supports any search engine provider and JavaScript framework.

It is developed and maintained by [Elastic](https://elastic.co).

You can use Search UI to quickly build robust, enjoyable, fully-featured search experiences.

To begin, choose your framework:

- [React](packages/react-search-ui/README.md)
- More coming! [Contributions](#contribute-) welcome.

_Note: The Search UI is in beta. We do not recommend production use._

## Developing Search UI

### Requirements

Node: 8.10
NPM: 6.4

### Mono-repo explanation

This repository is maintained as a Monorepo using [Lerna](https://lernajs.io/).

Lerna configuration is contained in `lerna.json`.

`/packages` - Contains publishable search-ui npm packages.
`/examples` - Contains non-publishable examples of search-ui usage. They are declared
as "packages" in `lerna.json` so that `npx lerna bootstrap` will automatically wire up the
examples to local dependencies.

Because all examples are declared as "private", when running lerna commands other than bootstrap, (like `publish` and
`test`), the `--no-private` flag should be appended.

Dependencies are declared in a package.json hierarchy.

- / package.json - Dependencies for repo tooling, like `husky` and `lerna`.
- /packages package.json - Common dev dependencies for all Search UI npm packages. Any dev depenency that does not need to be called directly in a package level npm command
  can be delcared here.
- /packages/{package_name} package.json - Package specific dependencies.

Note that we do not encourage "hoisting" dependencies through lerna. This WILL
cause the examples applications to error out from dependency version conflicts.

### Installing dependencies

```shell
npm install
(cd packages && npm install)
npm run bootstrap
```

### Building

All packages:

```shell
# from project root
npm run build
```

Single package:

```shell
# from inside a package
npm run build
```

### Testing

All packages:

```shell
# from project root
npm run test
```

Single package:

```shell
# from inside a package
npm run test
```

### Sandbox

The [sandbox](examples/sandbox/README.md) app can be used as a local development
aid.

## Using

### Publishing

```
# Check which files have been changed, verify that
# the packages you expect to be changed are listed.
npm run changed

git checkout -b "release-0.2.1"

# Manually update CHANGELOG files for updated repositories and commit them.

# Creates a new local commit with updated package.json files and tags. It's important
that you do not rewrite history after this release commit has been created.
npx lerna version 0.2.1 --no-push

git push --tags

## Go through PR approval and merge to master

git checkout master
git pull

# Then finally, publish
npm run publish
```

## FAQ 🔮

### Where do I report issues with the Search UI?

If something is not working as expected, please open an [issue](https://github.com/elastic/search-ui/issues/new).

### Where can I learn more about the Search UI?

Your best bet is to explore the READMEs.

### Where else can I go to get help?

If you are using an Elastic solution as your search Engine provider, try the community...

- [Elastic App Search discuss forums](https://discuss.elastic.co/c/app-search)
- [Elastic Site search discuss forums](https://discuss.elastic.co/c/site-search)

## Contribute 🚀

We welcome contributors to the project. Before you begin, a couple notes...

- Prior to opening a pull request, please create an issue to [discuss the scope of your proposal](https://github.com/elastic/search-ui/issues).
- Please write simple code and concise documentation, when appropriate.

## License 📗

[Apache-2.0](https://github.com/elastic/search-ui/blob/master/LICENSE) © [Elastic](https://github.com/elastic)

Thank you to all the [contributors](https://github.com/elastic/search-ui/graphs/contributors)!
