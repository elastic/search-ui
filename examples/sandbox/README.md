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
(cd ../.. && npm run bootstrap)

# Start watching search-ui js for changes in the various library repositories
(cd ../.. && npm run watch-js)

# Run the web application
npm start
```

Note: If you get error about dependency version conflicts, then you've probably
installed dependencies at the top level of this repository either by adding a
new dependency, or installing dependencies with hoisting `lerna boostrap --hoist".
