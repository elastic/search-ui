# Working with the docs

The [Search UI docs](https://www.elastic.co/guide/en/search-ui/current/overview.html) are written in [Docs V3](https://elastic.github.io/docs-builder/) and are built using [elastic/docs](https://github.com/elastic/docs).

## Build the docs locally

Before building the docs locally make sure you have:

- [docs-builder](https://elastic.github.io/docs-builder/contribute/locally/#step-one) install locally

Install `docs-builder` in a parent directory and run

```
../docs-builder serve -p ./docs
```

And open: [http://localhost:3000/reference/](http://localhost:3000/reference/)
