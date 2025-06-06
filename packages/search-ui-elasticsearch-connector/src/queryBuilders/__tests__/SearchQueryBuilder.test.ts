import { SearchQueryBuilder } from "../SearchQueryBuilder";
import type {
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
      categoryKeyword: { type: "value", field: "category.keyword" }
    },
    disjunctiveFacets: ["categoryKeyword"],
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
            categoryKeyword: {
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
          must: [
            {
              bool: {
                minimum_should_match: 1,
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
            categoryKeyword: {
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

    expect(query.query.bool.must[0].bool.should).toEqual([
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
                  gte: 10,
                  lte: 20
                }
              }
            },
            {
              range: {
                price: {
                  gte: 30,
                  lte: 40
                }
              }
            }
          ]
        }
      }
    ]);
  });

  describe("aggregations", () => {
    it("should handle range facet", () => {
      const rangeConfig: SearchQuery = {
        ...queryConfig,
        facets: {
          price: {
            type: "range",
            ranges: [
              { name: "0-100", from: 0, to: 100 } as FilterValueRange,
              { name: "100-200", from: 100, to: 200 } as FilterValueRange
            ]
          }
        }
      };

      const builder = new SearchQueryBuilder(state, rangeConfig);
      const query = builder.build();

      expect(query.aggs).toEqual({
        facet_bucket_all: {
          aggs: {
            price: {
              filters: {
                filters: {
                  "0-100": { range: { price: { gte: 0, lte: 100 } } },
                  "100-200": { range: { price: { gte: 100, lte: 200 } } }
                }
              }
            }
          },
          filter: {
            bool: {
              must: []
            }
          }
        }
      });
    });

    it("should handle geo distance facet", () => {
      const geoConfig: SearchQuery = {
        ...queryConfig,
        facets: {
          location: {
            type: "range",
            center: "0,0",
            unit: "km",
            ranges: [
              { name: "0-1km", from: 0, to: 1 } as FilterValueRange,
              { name: "1-2km", from: 1, to: 2 } as FilterValueRange
            ]
          }
        }
      };

      const builder = new SearchQueryBuilder(state, geoConfig);
      const query = builder.build();

      expect(query.aggs).toEqual({
        facet_bucket_all: {
          aggs: {
            location: {
              geo_distance: {
                field: "location",
                origin: "0,0",
                unit: "km",
                keyed: true,
                ranges: [
                  { key: "0-1km", to: 1 },
                  { key: "1-2km", from: 1, to: 2 }
                ]
              }
            }
          },
          filter: {
            bool: {
              must: []
            }
          }
        }
      });
    });

    it("should handle multiple facets", () => {
      const multiFacetConfig: SearchQuery = {
        ...queryConfig,
        facets: {
          "category.keyword": { type: "value" },
          price: {
            type: "range",
            ranges: [
              { name: "0-100", from: 0, to: 100 } as FilterValueRange,
              { name: "100-200", from: 100, to: 200 } as FilterValueRange
            ]
          }
        }
      };

      const builder = new SearchQueryBuilder(state, multiFacetConfig);
      const query = builder.build();

      expect(query.aggs).toEqual({
        facet_bucket_all: {
          aggs: {
            "category.keyword": {
              terms: {
                field: "category.keyword",
                order: { _count: "desc" },
                size: 20
              }
            },
            price: {
              filters: {
                filters: {
                  "0-100": { range: { price: { gte: 0, lte: 100 } } },
                  "100-200": { range: { price: { gte: 100, lte: 200 } } }
                }
              }
            }
          },
          filter: {
            bool: {
              must: []
            }
          }
        }
      });
    });

    it("should handle custom facet size", () => {
      const customSizeConfig: SearchQuery = {
        ...queryConfig,
        facets: {
          "category.keyword": { type: "value", size: 50 }
        }
      };

      const builder = new SearchQueryBuilder(state, customSizeConfig);
      const query = builder.build();

      expect(
        query.aggs.facet_bucket_all.aggs["category.keyword"].terms.size
      ).toBe(50);
    });

    it("should handle facet sorting", () => {
      const sortedConfig: SearchQuery = {
        ...queryConfig,
        facets: {
          "category.keyword": { type: "value", sort: "value" }
        }
      };

      const builder = new SearchQueryBuilder(state, sortedConfig);
      const query = builder.build();

      expect(
        query.aggs.facet_bucket_all.aggs["category.keyword"].terms.order
      ).toEqual({ _key: "asc" });
    });

    it("should handle disjunctive facets", () => {
      const disjunctiveConfig: SearchQuery = {
        ...queryConfig,
        disjunctiveFacets: ["category.keyword", "price"],
        facets: {
          "category.keyword": { type: "value" },
          price: {
            type: "range",
            ranges: [
              { name: "0-100", from: 0, to: 100 } as FilterValueRange,
              { name: "100-200", from: 100, to: 200 } as FilterValueRange
            ]
          }
        }
      };

      const builder = new SearchQueryBuilder(state, disjunctiveConfig);
      const query = builder.build();

      expect(query.aggs).toEqual({
        facet_bucket_all: {
          aggs: {
            "category.keyword": {
              terms: {
                field: "category.keyword",
                order: { _count: "desc" },
                size: 20
              }
            },
            price: {
              filters: {
                filters: {
                  "0-100": { range: { price: { gte: 0, lte: 100 } } },
                  "100-200": { range: { price: { gte: 100, lte: 200 } } }
                }
              }
            }
          },
          filter: {
            bool: {
              must: []
            }
          }
        }
      });
    });

    it("should handle must, must_not, and should filters in aggregations", () => {
      const stateWithFilters: RequestState = {
        searchTerm: "",
        resultsPerPage: 10,
        current: 1,
        filters: [
          { type: "all", field: "category.keyword", values: ["electronics"] }, // must
          { type: "none", field: "brand.keyword", values: ["apple"] }, // must_not
          { type: "any", field: "color.keyword", values: ["red", "blue"] } // should
        ]
      };
      const config: SearchQuery = {
        result_fields: { title: { snippet: { size: 100, fallback: true } } },
        facets: {
          "category.keyword": { type: "value" },
          "brand.keyword": { type: "value" },
          "color.keyword": { type: "value" }
        }
      };
      const builder = new SearchQueryBuilder(stateWithFilters, config);
      const aggs = builder.build().aggs;
      expect(aggs).toEqual({
        facet_bucket_all: {
          aggs: {
            "brand.keyword": {
              terms: {
                field: "brand.keyword",
                order: {
                  _count: "desc"
                },
                size: 20
              }
            },
            "category.keyword": {
              terms: {
                field: "category.keyword",
                order: {
                  _count: "desc"
                },
                size: 20
              }
            },
            "color.keyword": {
              terms: {
                field: "color.keyword",
                order: {
                  _count: "desc"
                },
                size: 20
              }
            }
          },
          filter: {
            bool: {
              must: [
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
                    must_not: [
                      {
                        term: {
                          "brand.keyword": "apple"
                        }
                      }
                    ]
                  }
                },
                {
                  bool: {
                    should: [
                      {
                        term: {
                          "color.keyword": "red"
                        }
                      },
                      {
                        term: {
                          "color.keyword": "blue"
                        }
                      }
                    ]
                  }
                }
              ]
            }
          }
        }
      });
    });
  });

  describe("buildQuery", () => {
    it("should not add filters that are also facets", () => {
      const stateWithFilters: RequestState = {
        ...state,
        searchTerm: "",
        filters: [
          { type: "all", field: "category.keyword", values: ["electronics"] }
        ]
      };
      const configWithoutFilters = {
        ...queryConfig,
        filters: []
      };
      const builder = new SearchQueryBuilder(
        stateWithFilters,
        configWithoutFilters
      );
      const query = builder.build();

      expect(query.query).toBeUndefined();
    });

    it("should combine state filters and base filters when search term is empty", () => {
      const stateWithFilters: RequestState = {
        ...state,
        searchTerm: "",
        filters: [
          {
            type: "all",
            field: "brand.keyword",
            values: ["apple"]
          },
          {
            type: "all",
            field: "category.keyword",
            values: ["phones"]
          }
        ]
      };

      const configWithFilters: SearchQuery = {
        ...queryConfig,
        filters: [
          {
            type: "all",
            field: "category.keyword",
            values: ["electronics"]
          }
        ]
      };

      const builder = new SearchQueryBuilder(
        stateWithFilters,
        configWithFilters
      );
      const query = builder.build();

      expect(query.query).toEqual({
        bool: {
          filter: [
            {
              bool: {
                filter: [
                  {
                    term: {
                      "brand.keyword": "apple"
                    }
                  }
                ]
              }
            },
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
      });
    });

    describe("fuzziness", () => {
      it("should not add fuzziness when not configured", () => {
        const builder = new SearchQueryBuilder(state, queryConfig);
        const query = builder.build();

        expect(
          query.query.bool.must[0].bool.should[0].multi_match.fuzziness
        ).toBeUndefined();
      });

      it("should add AUTO fuzziness when configured", () => {
        const configWithFuzziness: SearchQuery = {
          ...queryConfig,
          fuzziness: true
        };

        const builder = new SearchQueryBuilder(state, configWithFuzziness);
        const query = builder.build();

        expect(
          query.query.bool.must[0].bool.should[0].multi_match.fuzziness
        ).toBe("AUTO");

        expect(query.query.bool.must[0].bool.should).toEqual([
          {
            multi_match: {
              fields: [],
              fuzziness: "AUTO",
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
        ]);
      });
    });
  });

  describe("getQueryFn", () => {
    it("should use custom query function when provided", () => {
      const customQuery = {
        bool: {
          match: {
            title: {
              query: "test",
              boost: 2
            }
          }
        }
      };

      const getQueryFn = jest.fn().mockReturnValue(customQuery);
      const builder = new SearchQueryBuilder(state, queryConfig, getQueryFn);
      const query = builder.build();

      expect(getQueryFn).toHaveBeenCalledWith(state, queryConfig);
      expect(query.query).toEqual({
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
          match: {
            title: {
              boost: 2,
              query: "test"
            }
          }
        }
      });
    });

    it("should combine custom query with filters", () => {
      const customQuery = {
        bool: {
          must: [
            {
              match: {
                title: "test"
              }
            }
          ]
        }
      };

      const getQueryFn = jest.fn().mockReturnValue(customQuery);
      const stateWithFilters: RequestState = {
        ...state,
        filters: [
          {
            type: "all",
            field: "category.keyword",
            values: ["electronics"]
          }
        ]
      };

      const builder = new SearchQueryBuilder(
        stateWithFilters,
        queryConfig,
        getQueryFn
      );
      const query = builder.build();

      expect(query.query).toEqual({
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
          must: [
            {
              match: {
                title: "test"
              }
            }
          ]
        }
      });
    });
  });
});
