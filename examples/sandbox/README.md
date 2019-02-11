# Sandbox

This example is a sandbox for local development. It sets up a basic page
using Search UI.

It is wired up to use the local source of the search-ui libraries as dependencies via lerna.
This means as you update library code you can see it updated live in this project.

It is set up to use a pre-configured Elastic App Search engine.

NOTE: This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).
There is a setting in `.env` that tells create-react-app not to complain about the fact
that we have a version of babel-eslint defined explicitly in our package.json. This
is necessary to avoid conflicts between our development dependencies and the top level
package.json file.

## Using

To run:

```
# Bootstrapping with lerna will install all dependencies for this entire
# repository.
npx lerna boostrap

# Start watching js for changes in the various library repositories
(cd ../../packages/search-ui/ && npm run watch-js)
(cd ../../packages/react-search-ui/ && npm run watch-js)
(cd ../../packages/react-search-ui-views/ && npm run watch-js)

# Run the web application
npm start
```
