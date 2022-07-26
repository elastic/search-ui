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
        // specify the fields you want from the index to display the results
        image: { raw: {} },
        name: { snippet: { size: 100, fallback: true } },
        url: { raw: {} }
      },
      search_fields: {
        // specify the fields you want to search on
        name: {}
      }
    },
    suggestions: {
      types: {
        popularQueries: {
          search_fields: {
            "name.suggest": {} // fields used to query
          },
          result_fields: {
            name: {
              raw: {}
            },
            "category.name": {
              raw: {}
            }
          },
          index: "popular_queries",
          queryType: "results"
        }
      },
      size: 10
    }
  },
  apiConnector: connector
};
