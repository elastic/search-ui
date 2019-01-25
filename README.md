# Search UI

**NOTE: This library is in an early Beta period, it is not yet recommended for production use**

[![CircleCI](https://circleci.com/gh/elastic/search-ui/tree/master.svg?style=svg&circle-token=c637bc2af60035a1f4cb5367071999ced238be76)](https://circleci.com/gh/elastic/search-ui/tree/master)

Search UI is a group of libraries that enable fast development of excellent search experiences using any search engine provider.
You can get started by visiting the primary [React Search UI Library](packages/react-search-ui/README.md).

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

### Publishing

```
# Check which files have been changed, verify that
# the packages you expect to be changed are listed.
npx lerna changed

# Update package.json to new version for all changed packages
npx lerna version minor --no-push

# Manually update CHANGELOG files for updated repositories, until this
# can be automated
git add .
# Reword commit and add changelogs
git commit --amend
git push

# Then finally, publish
npx lerna publish 0.2.0
```
