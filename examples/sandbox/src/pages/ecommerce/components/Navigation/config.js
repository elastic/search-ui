import ElasticsearchAPIConnector from "@elastic/search-ui-elasticsearch-connector";

const connector = new ElasticsearchAPIConnector({
  apiKey: "MzlMME5JSUJjc1JKQVo5RzBxNzU6c1htam8zWDFUc1NSRTJyQ2ZMN05lQQ==",
  cloud: {
    id: "Search_UI_sandbox:dXMtY2VudHJhbDEuZ2NwLmNsb3VkLmVzLmlvJGEwN2I0NTJlNGRjOTQ0NzBiNjQyNDc3NTI2Njk2NjAzJDNkYWJjZmM3YzQ2MTRiNGM5NzI3OWI1YzYzZTY1YmFj"
  },
  index: "search-best-buy"
});

export const config = {
  alwaysSearchOnInitialLoad: false,
  autocompleteQuery: {
    results: {
      resultsPerPage: 5,
      result_fields: {
        image: { raw: {} },
        name: { snippet: { size: 100, fallback: true } },
        url: { raw: {} }
      },
      search_fields: {
        name_product_autocomplete: {}
      }
    }
  },
  apiConnector: connector
};
