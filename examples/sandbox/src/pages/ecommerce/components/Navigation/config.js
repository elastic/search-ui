import ElasticsearchAPIConnector from "@elastic/search-ui-elasticsearch-connector";

const connector = new ElasticsearchAPIConnector({
  apiKey: "MmszSk9wb0JFcFk0ajV5YjRIMHE6MnNnVVNvbHdScE9nZU9ERU9xcEFXQQ==",
  cloud: {
    id: "Search_UI_sandbox:dXMtY2VudHJhbDEuZ2NwLmNsb3VkLmVzLmlvJGEwN2I0NTJlNGRjOTQ0NzBiNjQyNDc3NTI2Njk2NjAzJDNkYWJjZmM3YzQ2MTRiNGM5NzI3OWI1YzYzZTY1YmFj"
  },
  index: "search-best-buy"
});

export const config = {
  alwaysSearchOnInitialLoad: false,
  trackUrlState: false,
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
        },
        categories: {
          search_fields: {
            "category.suggest": {}
          },
          result_fields: {
            category: {
              raw: {}
            }
          },
          index: "bb-categories",
          queryType: "results"
        }
      },
      size: 5
    }
  },
  apiConnector: connector
};
