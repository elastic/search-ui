# Search UI + Elasticsearch Example

https://search-ui-stable-elasticsearch.netlify.com/

## About

This is an example of Search UI using Elasticsearch as a Search API.

As noted elsewhere, when using Elasticsearch as a Search API, no Connector is available,
so we need to write Handlers ourselves.

This takes a bit more effort than using a Connector, but it provides a lot of flexibility. This example
should give Elasticsearch users a bit of a head start when using Search UI.

## Setup

Index the National Parks data set from `/data` into an Elasticsearch index named "national-parks".

You could download and install an instance [locally](https://www.elastic.co/products/elasticsearch), or
create an engine on [Elastic Cloud](https://www.elastic.co/cloud/).

```
npm install
```

### Run

Run the following command, filling in the variables below with your own credentials and host.

```
ELASTICSEARCH_HOST=https://{user}:{password}@{elasticsearch_url} npm start
```

Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Always proxy your Elasticsearch instance

It is NEVER recommended to directly query your Elasticsearch index from a browser.

This project includes a [Netlify](https://www.netlify.com/) [Function](https://www.netlify.com/docs/functions/) which proxies your Elasticsearch index and keeps your credentials safe.

## Deployment

This project is meant to be deployed to Netlify.

A `netlify.toml` file is included with all of the configuration you'll need to deploy
it to Netlify.

You'll additionally need to configure `ELASTICSEARCH_HOST` as an environment variable.
