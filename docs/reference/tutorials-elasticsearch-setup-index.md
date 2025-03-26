---
mapped_pages:
  - https://www.elastic.co/guide/en/search-ui/current/tutorials-elasticsearch-setup-index.html
---

# Setup an Index [tutorials-elasticsearch-setting-up-an-index]

We are going to issue commands via [Kibana’s dev tools console](docs-content://explore-analyze/query-filter/tools/console.md). You can alternatively use a REST client like Postman to achieve this.

First we need to create an index for our data. We can do this simply via the following request:

```shell
PUT /my-example-movies
```

:::{image} images/create-index.jpeg
:alt: Create Index
:class: screenshot
:::

Elasticsearch will acknowledge our request in the response.

## Mapping Examples [tutorials-elasticsearch-examples]

Next we need to setup the index fields, ready for us to ingest data.

The [mapping](https://www.elastic.co/guide/en/elasticsearch/reference/current/mapping.html) for an index depends on the data you want to index and the features you want.

### Searchable Fields [tutorials-elasticsearch-setting-up-an-index-examples-searchable]

We want to be able to search on title. We need only one field of type text.

```json
{
  "properties": {
    "title": {
      "type": "text"
    }
  }
}
```

### Searchable and Filterable Fields [tutorials-elasticsearch-setting-up-an-index-filterable]

We want to be able to search and product facets for writers field. We need two fields of different types: keyword and text.

```json
{
  "properties": {
    "writers": {
      "type": "text",
      "fields": {
        "keyword": {
          "type": "keyword"
        }
      }
    }
  }
}
```

### Date fields for Facets [tutorials-elasticsearch-setting-up-an-index-date-facet]

We want to be able to filter on a date field. We only need one date field.

```json
{
  "properties": {
    "released": {
      "type": "date"
    }
  }
}
```

### Numerical fields for Facets [tutorials-elasticsearch-setting-up-an-index-numeric]

We want to be able to filter on a numeric field. We only need one numeric field. Can be a choice of integer, float and [more documented here](elasticsearch://reference/elasticsearch/mapping-reference/number.md)

```json
{
  "properties": {
    "imdbRating": {
      "type": "float"
    }
  }
}
```

## Index Movies Mapping [tutorials-elasticsearch-settion-up-an-index-movies-mapping]

For our movie data-set, we will be using the following fields:

- title (searchable)
- plot (searchable)
- genre (searchable, facetable)
- actors (searchable, facetable)
- directors (searchable, facetable)
- released (filterable)
- imdbRating (filterable)
- url

The mapping file will be as follows, and we’ll once again use Kibana’s dev tools console to update the mapping file for our index.

```shell
PUT /my-example-movies/_mapping
{
  "properties": {
    "title": {
      "type": "text",
      "fields": {
        "suggest": {
          "type": "search_as_you_type"
        }
      }
    },
    "plot": {
      "type": "text"
    },
    "genre": {
      "type": "text",
      "fields": {
        "keyword": {
          "type": "keyword"
        }
      }
    },
    "actors": {
      "type": "text",
      "fields": {
        "keyword": {
          "type": "keyword"
        }
      }
    },
    "directors": {
      "type": "text",
      "fields": {
        "keyword": {
          "type": "keyword"
        }
      }
    },
    "released": {
      "type": "date"
    },
    "imdbRating": {
      "type": "float"
    },
    "url": {
      "type": "keyword"
    },
    "movie_completion": {
      "type": "completion"
    }
  }
}
```

:::{image} images/update-mapping.jpeg
:alt: add mapping
:class: screenshot
:::

Elasticsearch will acknowledge the request in the response.

We also want to provide autocomplete functionality, so we need to setup fields for autocomplete.

For suggestions, we want to suggest terms that appear within the actors, directors and genre fields. For quick result hits, we want to suggest movies that partially match the title field.

In the above example:

- we have included `movie_completion` field, which is used to provide suggestion completion functionality. This field is not searchable, but is used to provide autocomplete functionality.
- we have included a `suggest` field for the title field. This field is searchable, but is used to provide "quick hits" functionality.

## Index Movies Data [tutorials-elasticsearch-step-3-index-movies-data]

Now with our index and mapping file created, we are ready to index some data! We will use the bulk API to index our data.

We will use the following request. In this example we will be indexing the first movie in the data-set to verify that the data fields is being indexed correctly.

```shell
PUT /my-example-movies/_bulk
{ "index": {}}
{
  "title": "The Godfather",
  "released": "1972-03-23T23:00:00.000Z",
  "genre": ["Crime", "Drama"],
  "directors": ["Francis Ford Coppola"],
  "actors": ["Marlon Brando", "Al Pacino", "James Caan", "Richard S. Castellano"],
  "plot": "The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son","imdbRating": "9.2",
  "movie_completion": ["Crime", "Drama", "Marlon Brando", "Al Pacino", "James Caan", "Richard S. Castellano"],
  "url": "https://www.imdb.com/title/tt0068646/"
}
```

Your Elasticsearch instance is now ready to be used.
