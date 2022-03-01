const express = require('express')

const { ServerConnector } = require('@elastic/search-ui-elasticsearch-connector')
require('cross-fetch/polyfill');

const app = express()
const port = 4000

app.use(express.json());

ServerConnector({
  host: "http://localhost:9200", 
  index: "us_parks", 
  queryFields: ["title", "description", "states"]
})(app)

app.listen(port, () => {
  console.log(`Example ElasticSearch Sercer Connector ${port}`)
})