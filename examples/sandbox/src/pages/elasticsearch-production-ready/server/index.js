import express from "express";
import cors from "cors";
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

app.use(cors());
app.use(express.json());

app.post("/api/search", async (req, res, next) => {
  try {
    const { state, queryConfig } = req.body;
    const response = await connector.onSearch(state, queryConfig);
    res.json(response);
  } catch (error) {
    next(error);
  }
});

app.post("/api/autocomplete", async (req, res, next) => {
  try {
    const { state, queryConfig } = req.body;
    const response = await connector.onAutocomplete(state, queryConfig);
    res.json(response);
  } catch (error) {
    next(error);
  }
});

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
});

app.use((err, req, res) => {
  // eslint-disable-next-line no-console
  console.error("Server error:", err.stack);
  res
    .status(500)
    .json({ message: "Something went wrong!", error: err.message });
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server running on port ${PORT}`);
});
