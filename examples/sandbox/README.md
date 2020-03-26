# Sandbox

Sandbox with Elastic App Search: https://search-ui-stable.netlify.com/
Sandbox with Elastic Site Search: https://search-ui-stable-site-search.netlify.com/

This example is a sandbox for local development. It sets up a basic page
using Search UI.

It is wired up to use the local source of the search-ui libraries as dependencies via Lerna.
This means as you update library code you can see it updated live in this project.

It is set up to use a pre-configured Elastic App Search Engine. The data
set is the "Sample Engine" data set provided as an example for App Search
accounts. More info on that can be found in this [article](https://www.elastic.co/blog/a-walk-in-the-park-with-elastic-app-search-sample-engines).

To configure the Sandbox to use your own Engine, simply create a `.env` file
in the root of this Sandbox project, and configure the following properties which
can be found in your App Search dashboard:

```
REACT_APP_SEARCH_ENGINE_NAME=<PUT YOUR ENGINE NAME HERE>
REACT_APP_SEARCH_KEY=<PUT YOUR SEARCH KEY HERE>
REACT_APP_SEARCH_HOST_IDENTIFIER=<PUT YOUR HOST IDENTIFIER HERE>
REACT_APP_SEARCH_ENDPOINT_BASE=<PUT AN ENDPOINT BASE HERE IF YOU ARE USING SELF MANAGED APP SEARCH>
```

The Sandbox can be used with a pre-configured Site Search Engine, using the following configuration:

```
REACT_APP_SOURCE=SITE_SEARCH
```

## Running and using local development version of search-ui

This project requires a complex `npm link` based setup to properly run using your local search-ui source code.
To start this project properly, you'll need to start it from the root directory of the search-ui project
with the following commands

NOTE: The following is semi-destructive, it will "link" your "react" dependencies
in react-search-ui and react-search-ui-views. All that means is, when running
`npm test` on either one of those projects you may be prompted to run `npm unlink`
before continuing.

```shell
npm install
npm run sandbox
```

If you're actively developing Search UI and testing in this Sandbox, you'll probably want
to live reload your changes in this application. To do this, navigate to the root
level of this repository and run the following command.

```shell
# Run this from the root of this repository
npm run watch
```

Note: If you get error about dependency version conflicts when starting this application ...

You've probably installed dependencies at the top level of this repository either by adding a new dependency, or installing dependencies with hoisting (i.e. `lerna boostrap --hoist`).

To resolve this, delete the `node_modules` directory at all levels and try this process again.

To delete all `node_modules` directories:

```shell
# Run this to clear all node_modules director
# Run this from the root of this repository
rm -rf node_modules
rm -rf packages/node_modules
npx lerna exec -- rm -rf node_modules
```

## Running stand-alone

To start this project against the released versions of search-ui libs defined in the local `package.json`, simply
run the following commands from within THIS directory.

```
npm install
npm start
```

## Startup options

This project can also be started, using a Site Search connector, rather than an
App Search connector, using the following command.

```shell
REACT_APP_SOURCE=SITE_SEARCH npm start
```
