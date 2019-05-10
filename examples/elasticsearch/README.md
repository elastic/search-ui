## Setup

In the project directory, you can run:

### Run

Index the National Parks data set from `/data` into an Elasticsearch index named "national-parks".

```
npm install
```

Start, filling in the variables below with your own credentials and host.

```
ELASTICSEARCH_HOST=https://{user}:{password}@{elasticsearch_url} npm start
```

Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Always proxy your Elasticsearch instance

It is NEVER recommended to directly query your Elasticsearch index from a browser.

This project includes a [Netlify](https://www.netlify.com/) [Function](https://www.netlify.com/docs/functions/) which proxies your Elasticsearch index and keeps your credentials safe.

Netlify Functions can be run locally as well as on the actual Netlify deployment platform. When you run the `npm start` command listed above, this will all happen for you automatically.

You can look at the scripts in `package.json` to get a sense for how this works.

If you wish to run the

## Deployment

This project is meant to be deployed to Netlify.

A `netlify.toml` file is included with all of the configuration you'll need to deploy
it to Netlify.

You'll additionally need to configure `ELASTICSEARCH_HOST` as an environment variable.
