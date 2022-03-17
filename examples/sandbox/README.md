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

```shell
yarn
yarn start
```

If you're actively developing Search UI and testing in this Sandbox, you'll probably want
to live reload your changes in this application. To do this, navigate to the root
level of this repository and run the following command.

```shell
# Run this from the root of this repository
yarn watch
```

## Startup options

This project can also be started, using a Site Search or Workplace Search connector, rather than an App Search connector, using the following commands:

```shell
# Site Search
REACT_APP_SOURCE=SITE_SEARCH npm start

# Workplace Search
REACT_APP_SOURCE=WORKPLACE_SEARCH yarn start
```
