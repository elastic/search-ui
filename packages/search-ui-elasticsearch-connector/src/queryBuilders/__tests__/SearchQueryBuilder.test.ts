import { SearchQueryBuilder } from "../SearchQueryBuilder";
import {
  FilterValueRange,
  RequestState,
  SearchQuery
} from "@elastic/search-ui";

describe("SearchQueryBuilder", () => {
  const state: RequestState = {
    searchTerm: "test",
    resultsPerPage: 10,
    current: 1
  };

  const queryConfig: SearchQuery = {
    result_fields: {
      title: {
        snippet: {
          size: 100,
          fallback: true
        }
      }
    },
    facets: {
      "category.keyword": { type: "value" }
    },
    disjunctiveFacets: ["category.keyword"],
    filters: [
      {
        type: "all",
        field: "category.keyword",
        values: ["electronics"]
      }
    ]
  };

  it("should build search query", () => {
    const builder = new SearchQueryBuilder(state, queryConfig);
    const query = builder.build();

    expect(query).toEqual({
      _source: {
        includes: ["title"]
      },
      aggs: {
        facet_bucket_all: {
          aggs: {
            "category.keyword": {
              terms: {
                field: "category.keyword",
                order: {
                  _count: "desc"
                },
                size: 20
              }
            }
          },
          filter: {
            bool: {
              must: []
            }
          }
        }
      },
      from: 0,
      highlight: {
        fields: {
          title: {}
        }
      },
      query: {
        bool: {
          filter: [
            {
              bool: {
                filter: [
                  {
                    term: {
                      "category.keyword": "electronics"
                    }
                  }
                ]
              }
            }
          ],
          should: [
            {
              multi_match: {
                fields: [],
                operator: "and",
                query: "test",
                type: "best_fields"
              }
            },
            {
              multi_match: {
                fields: [],
                query: "test",
                type: "cross_fields"
              }
            },
            {
              multi_match: {
                fields: [],
                query: "test",
                type: "phrase"
              }
            },
            {
              multi_match: {
                fields: [],
                query: "test",
                type: "phrase_prefix"
              }
            }
          ]
        }
      },
      size: 10,
      sort: "_score"
    });
  });

  it("should handle empty search term", () => {
    const emptyState: RequestState = {
      ...state,
      searchTerm: ""
    };

    const builder = new SearchQueryBuilder(emptyState, queryConfig);
    const query = builder.build();

    expect(query).toEqual({
      _source: { includes: ["title"] },
      aggs: {
        facet_bucket_all: {
          aggs: {
            "category.keyword": {
              terms: {
                field: "category.keyword",
                order: { _count: "desc" },
                size: 20
              }
            }
          },
          filter: { bool: { must: [] } }
        }
      },
      from: 0,
      highlight: { fields: { title: {} } },
      query: {
        bool: {
          filter: [
            {
              bool: {
                filter: [
                  {
                    term: {
                      "category.keyword": "electronics"
                    }
                  }
                ]
              }
            }
          ]
        }
      },
      size: 10,
      sort: "_score"
    });
  });

  it("should handle custom search fields", () => {
    const customConfig: SearchQuery = {
      ...queryConfig,
      search_fields: {
        title: { weight: 2 },
        description: { weight: 1 }
      }
    };

    const builder = new SearchQueryBuilder(state, customConfig);
    const query = builder.build();

    expect(query.query.bool.should).toEqual([
      {
        multi_match: {
          fields: ["title^2", "description^1"],
          operator: "and",
          query: "test",
          type: "best_fields"
        }
      },
      {
        multi_match: {
          fields: ["title^2", "description^1"],
          query: "test",
          type: "cross_fields"
        }
      },
      {
        multi_match: {
          fields: ["title^2", "description^1"],
          query: "test",
          type: "phrase"
        }
      },
      {
        multi_match: {
          fields: ["title^2", "description^1"],
          query: "test",
          type: "phrase_prefix"
        }
      }
    ]);
  });

  it("should handle multiple filters", () => {
    const multiFilterConfig: SearchQuery = {
      ...queryConfig,
      filters: [
        {
          type: "all",
          field: "category.keyword",
          values: ["electronics"]
        },
        {
          type: "any",
          field: "price",
          values: [
            { from: 10, to: 20 } as FilterValueRange,
            { from: 30, to: 40 } as FilterValueRange
          ]
        }
      ]
    };

    const builder = new SearchQueryBuilder(state, multiFilterConfig);
    const query = builder.build();

    expect(query.query.bool.filter).toEqual([
      {
        bool: {
          filter: [
            {
              term: {
                "category.keyword": "electronics"
              }
            }
          ]
        }
      },
      {
        bool: {
          should: [
            {
              range: {
                price: {
                  from: 10,
                  to: 20
                }
              }
            },
            {
              range: {
                price: {
                  from: 30,
                  to: 40
                }
              }
            }
          ]
        }
      }
    ]);
  });
});
