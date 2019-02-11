# Sandbox

This example is a sandbox for local development. It sets up a basic page
using Search UI.

It is wired up to use the local source of the search-ui libraries as dependencies via lerna.
This means as you update library code you can see it updated live in this project.

It is set up to use a pre-configured Elastic App Search engine.

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
