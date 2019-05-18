# Search UI + Elasticsearch Example

https://search-ui-stable-elasticsearch.netlify.com/

## About

This is an example of Search UI using Elasticsearch as a Search API.

As noted elsewhere, when using Elasticsearch as a Search API, no Connector is available, so we need to write Handlers ourselves.
This process is described in the [Connectors and Handlers](../../ADVANCED.md#connectors-and-handlers) section of the Advanced
guide.

This takes a bit more effort than using a Connector, but it provides a lot of flexibility. This example
should give Elasticsearch users a bit of a head start when using Search UI.

### What the Handlers actually do

The Handlers in this project convert [Application State to Elasticsearch requests](src/buildRequest.js), and then [Elasticsearch responses back to Application State](src/buildState.js).

## Setup

### Setup Elasticsearch

To get this project working, you'll first need to have an Elasticsearch instance set up and data indexed.

The National Parks data set that this project uses can be found in `/data`. That data should be indexed into an Elasticsearch index named "national-parks".

If you do not yet have Elasticsearch installed, you can download and [install an instance locally](https://www.elastic.co/products/elasticsearch), or
create a deployment on [Elastic Cloud](https://www.elastic.co/cloud/).

### Setup this project

Just clone the project and run the following in this directory:

```
npm install
```

### Run

Run the following command, filling in the variables below with your own Elasticsearch credentials and host.

```
ELASTICSEARCH_HOST=https://{user}:{password}@{elasticsearch_url} npm start
```

Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Always proxy your Elasticsearch instance

It is **never** recommended to directly query your Elasticsearch index from a browser.

This project includes a [Netlify Function](https://www.netlify.com/docs/functions/) which proxies your Elasticsearch.

## Deployment

This project is meant to be deployed to Netlify.

A `netlify.toml` file is included with all of the configuration you'll need to deploy it to Netlify.

You'll additionally need to configure `ELASTICSEARCH_HOST` as an environment variable.
