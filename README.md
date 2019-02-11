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

### Publishing

```
# Check which files have been changed, verify that
# the packages you expect to be changed are listed.
npx lerna changed

# Update package.json to new version for all changed packages
npx lerna version 0.2.1 --no-push -m "Release 0.2.1"

# Manually update CHANGELOG files for updated repositories, until this
# can be automated
git add .
# Add CHANGELOG files
git commit --amend
git push --tags

# Then finally, publish
npx lerna exec -- npm publish
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
