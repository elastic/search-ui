# Working with the docs

The [Search UI docs](https://www.elastic.co/guide/en/search-ui/current/overview.html) are written in [AsciiDoc](https://github.com/elastic/docs?tab=readme-ov-file#asciidoc-guide) and are built using [elastic/docs](https://github.com/elastic/docs).

## Build the docs locally

Before building the docs locally make sure you have:

* Docker
* Python 3
* [elastic/docs](https://github.com/elastic/docs) cloned locally

Assuming your local copy of the elastic/docs repo is in the same repo as your local copy of this repo, run this command from inside your local copy of this repo:

```
../docs/build_docs --doc ./docs/index.asciidoc --chunk 3 --open
```
