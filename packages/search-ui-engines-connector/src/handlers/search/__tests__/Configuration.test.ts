import type {
  FieldConfiguration,
  QueryConfig,
  RequestState
} from "@elastic/search-ui";
import buildConfiguration, {
  buildBaseFilters,
  getResultFields
} from "../Configuration";
jest.mock("@searchkit/sdk");
import {
  RefinementSelectFacet,
  MultiQueryOptionsFacet,
  GeoDistanceOptionsFacet,
  Filter
} from "@searchkit/sdk";

import { EngineQuery } from "../Query";

jest.mock("../Query", () => {
  return {
    EngineQuery: jest.fn()
  };
});

import { LIB_VERSION } from "../../../version";

describe("Search - Configuration", () => {
  describe("getResultFields", () => {
    it("empty configuration", () => {
      const resultFields: Record<string, FieldConfiguration> = {};

      expect(getResultFields(resultFields)).toEqual({
        hitFields: [],
        highlightFields: []
      });
    });

    it("group fields by configuration", () => {
      const resultFields: Record<string, FieldConfiguration> = {
        title: {
          raw: {},
          snippet: {}
        },
        description: {
          snippet: {}
        },
        url: {
          raw: {}
        }
      };

      expect(getResultFields(resultFields)).toEqual({
        hitFields: ["title", "description", "url"],
        highlightFields: ["title", "description"]
      });
    });
  });

  it("buildBaseFilters", () => {
    const queryConfig: QueryConfig = {
      filters: [
        {
          field: "provider.id.keyword",
          type: "any",
          values: [
            "00000174-b680-e5d9-b8fb-15ae80000000",
            "0000014d-91eb-0b07-8ac7-287f80000000"
          ]
        },
        {
          field: "kind.keyword",
          type: "none",
          values: ["Instrument", "Watercraft"]
        },
        {
          field: "attribute_facets.keyword",
          type: "all",
          values: ["Part of Collection", "Access Restriction(s)"]
        },
        {
          field: "rangeFilterExample",
          type: "all",
          values: [
            {
              from: 0,
              to: 1000,
              name: "Small"
            }
          ]
        }
      ]
    };

    expect(buildBaseFilters(queryConfig.filters)).toMatchInlineSnapshot(`
      [
        {
          "bool": {
            "should": [
              {
                "term": {
                  "provider.id.keyword": "00000174-b680-e5d9-b8fb-15ae80000000",
                },
              },
              {
                "term": {
                  "provider.id.keyword": "0000014d-91eb-0b07-8ac7-287f80000000",
                },
              },
            ],
          },
        },
        {
          "bool": {
            "must_not": [
              {
                "term": {
                  "kind.keyword": "Instrument",
                },
              },
              {
                "term": {
                  "kind.keyword": "Watercraft",
                },
              },
            ],
          },
        },
        {
          "bool": {
            "filter": [
              {
                "term": {
                  "attribute_facets.keyword": "Part of Collection",
                },
              },
              {
                "term": {
                  "attribute_facets.keyword": "Access Restriction(s)",
                },
              },
            ],
          },
        },
        {
          "bool": {
            "filter": [
              {
                "range": {
                  "rangeFilterExample": {
                    "from": 0,
                    "to": 1000,
                  },
                },
              },
            ],
          },
        },
      ]
    `);

    expect(buildBaseFilters(undefined)).toEqual([]);
  });

  describe("buildConfiguration", () => {
    const queryConfig: QueryConfig = {
      search_fields: {
        title: {
          weight: 2
        },
        description: {}
      },
      result_fields: {
        title: {
          snippet: {}
        },
        description: {
          snippet: {}
        },
        url: {
          raw: {}
        }
      },
      facets: {
        category: {
          type: "value",
          size: 20
        },
        type: {
          type: "value",
          size: 20,
          sort: "value"
        }
      },
      disjunctiveFacets: ["category"],
      filters: [
        {
          field: "provider.id.keyword",
          type: "any",
          values: [
            "00000174-b680-e5d9-b8fb-15ae80000000",
            "0000014d-91eb-0b07-8ac7-287f80000000"
          ]
        },
        {
          field: "kind.keyword",
          type: "none",
          values: ["Instrument", "Watercraft"]
        },
        {
          field: "attribute_facets.keyword",
          type: "all",
          values: ["Part of Collection", "Access Restriction(s)"]
        }
      ]
    };

    it("builds configuration", () => {
      const state: RequestState = {
        searchTerm: "test",
        filters: [
          {
            field: "providerid.keyword",
            values: [
              {
                name: "precio",
                from: 10,
                to: 100
              }
            ],
            type: "all"
          },
          {
            field: "date.keyword",
            values: [
              {
                name: "date",
                from: "2021-01-01"
              }
            ],
            type: "all"
          }
        ]
      };
      const x = buildConfiguration({
        state,
        queryConfig
      });
      expect(x).toEqual(
        expect.objectContaining({
          host: "host",
          index: "engineName",
          connectionOptions: {
            headers: {
              "x-elastic-client-meta": `ent=${LIB_VERSION}-engines-connector,js=browser,t=${LIB_VERSION}-engines-connector,ft=universal`
            }
          },
          hits: {
            fields: ["title", "description", "url"],
            highlightedFields: ["title", "description"]
          }
        })
      );

      expect(EngineQuery).toHaveBeenCalled();

      expect(RefinementSelectFacet).toHaveBeenCalledTimes(2);
      expect(RefinementSelectFacet).toHaveBeenCalledWith({
        identifier: "category",
        field: "category",
        label: "category",
        size: 20,
        multipleSelect: true,
        order: "count"
      });
      expect(RefinementSelectFacet).toHaveBeenCalledWith({
        identifier: "type",
        field: "type",
        label: "type",
        size: 20,
        multipleSelect: false,
        order: "value"
      });
      expect(Filter).toHaveBeenCalledWith({
        field: "providerid.keyword",
        identifier: "providerid.keyword",
        label: "providerid.keyword"
      });
      expect(Filter).toHaveBeenCalledWith({
        field: "date.keyword",
        identifier: "date.keyword",
        label: "date.keyword"
      });
      expect(Filter).toHaveBeenCalledTimes(2);
    });

    it("works without facet configuration", () => {
      const state: RequestState = {
        searchTerm: "test"
      };

      expect(
        buildConfiguration({
          state,
          queryConfig: { ...queryConfig, facets: null }
        })
      ).toEqual(
        expect.objectContaining({
          host: "host",
          index: "engineName",
          connectionOptions: {
            headers: {
              "x-elastic-client-meta": `ent=${LIB_VERSION}-engines-connector,js=browser,t=${LIB_VERSION}-engines-connector,ft=universal`
            }
          },
          hits: {
            fields: ["title", "description", "url"],
            highlightedFields: ["title", "description"]
          }
        })
      );

      expect(EngineQuery).toHaveBeenCalled();

      expect(RefinementSelectFacet).toHaveBeenCalledTimes(2);
      expect(RefinementSelectFacet).toHaveBeenCalledWith({
        identifier: "category",
        field: "category",
        label: "category",
        size: 20,
        multipleSelect: true,
        order: "count"
      });
      expect(RefinementSelectFacet).toHaveBeenCalledWith({
        identifier: "type",
        field: "type",
        label: "type",
        size: 20,
        multipleSelect: false,
        order: "value"
      });
    });

    it("Range facets Configuration", () => {
      const state: RequestState = {
        searchTerm: "test"
      };

      const configuration = buildConfiguration({
        state,
        queryConfig: {
          ...queryConfig,
          disjunctiveFacets: [
            ...queryConfig.disjunctiveFacets,
            "date_established"
          ],
          facets: {
            acres: {
              type: "range",
              ranges: [
                { from: -1, name: "Any" },
                { from: 0, to: 1000, name: "Small" },
                { from: 1001, to: 100000, name: "Medium" },
                { from: 100001, name: "Large" }
              ]
            },
            location: {
              center: "37.7749, -122.4194",
              type: "range",
              unit: "mi",
              ranges: [
                { from: 0, to: 100, name: "Nearby" },
                { from: 100, to: 500, name: "A longer drive" },
                { from: 500, name: "Perhaps fly?" }
              ]
            },
            date_established: {
              type: "range",
              ranges: [
                {
                  from: "1952-03-14T10:34:22.464Z",
                  name: "Within the last 50 years"
                },
                {
                  from: "1922-03-14T10:34:22.464Z",
                  to: "1952-03-14T10:34:22.464Z",
                  name: "50 - 100 years ago"
                },
                {
                  to: "1922-03-14T10:34:22.464Z",
                  name: "More than 100 years ago"
                }
              ]
            }
          }
        }
      });

      expect(configuration).toEqual(
        expect.objectContaining({
          host: "host",
          index: "engineName",
          connectionOptions: {
            headers: {
              "x-elastic-client-meta": `ent=${LIB_VERSION}-engines-connector,js=browser,t=${LIB_VERSION}-engines-connector,ft=universal`
            }
          },
          hits: {
            fields: ["title", "description", "url"],
            highlightedFields: ["title", "description"]
          }
        })
      );

      const validHeaderRegex =
        // eslint-disable-next-line no-useless-escape
        /^[a-z]{1,}=[a-z0-9\.\-]{1,}(?:,[a-z]{1,}=[a-z0-9\.\-]+)*$/;
      expect(
        configuration.connectionOptions.headers["x-elastic-client-meta"]
      ).toMatch(validHeaderRegex);

      expect(GeoDistanceOptionsFacet).toHaveBeenCalledTimes(1);
      expect(GeoDistanceOptionsFacet).toHaveBeenCalledWith({
        field: "location",
        identifier: "location",
        label: "location",
        multipleSelect: false,
        origin: "37.7749, -122.4194",
        ranges: [
          {
            label: "Nearby",
            to: 100
          },
          {
            from: 100,
            label: "A longer drive",
            to: 500
          },
          {
            from: 500,
            label: "Perhaps fly?"
          }
        ],
        unit: "mi"
      });
      expect(MultiQueryOptionsFacet).toHaveBeenCalledTimes(2);
      expect(MultiQueryOptionsFacet).toHaveBeenCalledWith({
        field: "acres",
        identifier: "acres",
        label: "acres",
        multipleSelect: false,
        options: [
          {
            label: "Any",
            min: -1
          },
          {
            label: "Small",
            max: 1000,
            min: 0
          },
          {
            label: "Medium",
            max: 100000,
            min: 1001
          },
          {
            label: "Large",
            min: 100001
          }
        ]
      });
      expect(MultiQueryOptionsFacet).toHaveBeenCalledWith({
        field: "date_established",
        identifier: "date_established",
        label: "date_established",
        multipleSelect: true,
        options: [
          {
            dateMin: "1952-03-14T10:34:22.464Z",
            label: "Within the last 50 years"
          },
          {
            dateMax: "1952-03-14T10:34:22.464Z",
            dateMin: "1922-03-14T10:34:22.464Z",
            label: "50 - 100 years ago"
          },
          {
            dateMax: "1922-03-14T10:34:22.464Z",
            label: "More than 100 years ago"
          }
        ]
      });
    });
  });
});
