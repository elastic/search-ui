<p><a href="https://circleci.com/gh/elastic/search-ui/tree/master"><img src="https://circleci.com/gh/elastic/search-ui/tree/master.svg?style=svg&circle-token=c637bc2af60035a1f4cb5367071999ced238be76" alt="CircleCI buidl"></a>
  
> Libraries for the fast development of modern, engaging search experiences. 🎉
  
  Test

# Elastic Search UI

A [React](https://reactjs.org) library that allows you to quickly implement search experiences without re-inventing the wheel.

Check out our [full documentation site](https://docs.elastic.co/search-ui) which contains detailed documentation for setting up and using Search UI in your products.

## Running Locally

### Node

We depend upon the version of node defined in [.nvmrc](.nvmrc).

You will probably want to install a node version manager. [nvm](https://github.com/creationix/nvm) is recommended.

To install and use the correct node version with `nvm`:

```bash
nvm install
```

Install dependencies with yarn:
```
yarn
```

### Sandbox
  
A [sandbox application](https://github.com/elastic/search-ui/blob/master/examples/sandbox/README.md) is available to demo usage and act as a development aid.
  
To run it locally at [http://localhost:3000/](http://localhost:3000/):

```bash
yarn build
cd examples/sandbox
yarn start
```
  
Additional development tips are available in the [Search UI Contributor's Guide](./CONTRIBUTING.md)

## Contribute

We welcome contributors to the project. Before you begin, a couple notes...

- Read the [Search UI Contributor's Guide](./CONTRIBUTING.md).
- Prior to opening a pull request, please:
  - Create an issue to [discuss the scope of your proposal](https://github.com/elastic/search-ui/issues).
  - Sign the [Contributor License Agreement](https://www.elastic.co/contributor-agreement/). We are not asking you to assign copyright to us, but to give us the right to distribute your code without restriction. We ask this of all contributors in order to assure our users of the origin and continuing existence of the code. You only need to sign the CLA once.
- Please write simple code and concise documentation, when appropriate.

## License 📗

[Apache-2.0](https://github.com/elastic/search-ui/blob/master/LICENSE.txt) © [Elastic](https://github.com/elastic)

Thank you to all the [contributors](https://github.com/elastic/search-ui/graphs/contributors)!
