---
mapped_pages:
  - https://www.elastic.co/guide/en/search-ui/current/tutorials-elasticsearch-setup-cloud.html
---

# Setup Elasticsearch [tutorials-elasticsearch-setup-elasticsearch]

First we need to setup Elasticsearch. The easiest way to do this is to create an Elasticsearch instance via [Elastic Cloud](https://cloud.elastic.co/registration).

## Setting up a read-only API Key [tutorials-elasticsearch-setting-up-a-read-only-api-key]

Next we need to setup an API key to access the data from the index. We can do this via Kibana’s Stack Management API Keys page (`<your Kibana endpoint>/app/management/security/api_keys`). Note that security needs to be enabled for this option to be available.

Notice here we are only giving read privileges for this api key. You will need to setup an api key with write privileges to add and update data to the index.

```json
{
  "superuser": {
    "cluster": ["all"],
    "indices": [
      {
        "names": ["my-example-movies"],
        "privileges": ["read"],
        "allow_restricted_indices": false
      }
    ]
  }
}
```

:::{image} images/api-keys.jpeg
:alt: creating api key
:class: screenshot
:::

Once saved, you are presented with the api-key. Copy this and keep it safe. We will need to use this further down in the tutorial.

:::{image} images/api-key-view.jpeg
:alt: copy api key
:class: screenshot
:::

## Enabling CORS [tutorials-elasticsearch-enabling-cors]

If you’re going to be accessing Elasticsearch directly from a browser and the Elasticsearch host domain doesn’t match your site’s domain, you will need to enable CORS.

CORS is a browser mechanism which enables controlled access to resources located outside of the current domain. In order for the browser to make requests to Elasticsearch, CORS configuration headers need to specified in the Elasticsearch configuration.

:::{image} images/edit-settings.png
:alt: edit-deployment-settings
:class: screenshot
:::

You can do this in cloud by going to the deployment settings for your Elasticsearch instance, click "Edit user settings and plugins" and under "user settings", add the CORS configuration below:

```yaml
http.cors.allow-origin: "*"
http.cors.enabled: true
http.cors.allow-credentials: true
http.cors.allow-methods: OPTIONS, HEAD, GET, POST, PUT, DELETE
http.cors.allow-headers: X-Requested-With, X-Auth-Token, Content-Type, Content-Length, Authorization, Access-Control-Allow-Headers, Accept, x-elastic-client-meta
```

:::{image} images/cors-settings.png
:alt: edit-deployment-settings
:class: screenshot
:::

then save. Your Elasticsearch instance will be restarted and the CORS configuration will be active.
