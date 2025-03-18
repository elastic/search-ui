import express from "express";
import ElasticsearchAPIConnector from "@elastic/search-ui-elasticsearch-connector";

const app = express();
const PORT = process.env.PORT || 3001;

const connector = new ElasticsearchAPIConnector({
  host:
    process.env.ELASTICSEARCH_HOST ||
    "https://search-ui-sandbox.es.us-central1.gcp.cloud.es.io:9243",
  index: process.env.ELASTICSEARCH_INDEX || "national-parks",
  apiKey:
    process.env.ELASTICSEARCH_API_KEY ||
    "SlUzdWE0QUJmN3VmYVF2Q0F6c0I6TklyWHFIZ3lTbHF6Yzc2eEtyeWFNdw=="
});

app.use(express.json());

app.post("/api/search", async (req, res) => {
  const { requestState, queryConfig } = req.body;
  const response = await connector.onSearch(requestState, queryConfig);
  res.json(response);
});

app.post("/api/autocomplete", async (req, res) => {
  const { requestState, queryConfig } = req.body;
  const response = await connector.onAutocomplete(requestState, queryConfig);
  res.json(response);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
