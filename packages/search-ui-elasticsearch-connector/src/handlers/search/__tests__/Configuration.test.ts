import {
  FieldConfiguration,
  QueryConfig,
  RequestState
} from "@elastic/search-ui";
import buildConfiguration, { getResultFields } from "../Configuration";
jest.mock("@searchkit/sdk");
import {
  MultiMatchQuery,
  RefinementSelectFacet,
  MultiQueryOptionsFacet,
  GeoDistanceOptionsFacet
} from "@searchkit/sdk";
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
      disjunctiveFacets: ["category"]
    };
    const host = "http://localhost:9200";
    const index = "test_index";
    const apiKey = "apiKey";

    it("builds configuration", () => {
      const state: RequestState = {
        searchTerm: "test"
      };

      expect(
        buildConfiguration(state, queryConfig, host, index, apiKey)
      ).toEqual(
        expect.objectContaining({
          host: "http://localhost:9200",
          index: "test_index",
          connectionOptions: {
            apiKey: "apiKey",
            headers: {
              "x-elastic-client-meta": `ent=${LIB_VERSION}-es-connector,js=browser,t=${LIB_VERSION}-es-connector,ft=universal`
            }
          },
          hits: {
            fields: ["title", "description", "url"],
            highlightedFields: ["title", "description"]
          }
        })
      );

      expect(MultiMatchQuery).toHaveBeenCalledWith({
        fields: ["title^2", "description^1"]
      });

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

    it("works without facet configuration", () => {
      const state: RequestState = {
        searchTerm: "test"
      };

      expect(
        buildConfiguration(
          state,
          { ...queryConfig, facets: null },
          host,
          index,
          apiKey
        )
      ).toEqual(
        expect.objectContaining({
          host: "http://localhost:9200",
          index: "test_index",
          connectionOptions: {
            apiKey: "apiKey",
            headers: {
              "x-elastic-client-meta": `ent=${LIB_VERSION}-es-connector,js=browser,t=${LIB_VERSION}-es-connector,ft=universal`
            }
          },
          hits: {
            fields: ["title", "description", "url"],
            highlightedFields: ["title", "description"]
          }
        })
      );

      expect(MultiMatchQuery).toHaveBeenCalledWith({
        fields: ["title^2", "description^1"]
      });

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

      const configuration = buildConfiguration(
        state,
        {
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
        },
        host,
        index,
        apiKey
      );

      expect(configuration).toEqual(
        expect.objectContaining({
          host: "http://localhost:9200",
          index: "test_index",
          connectionOptions: {
            apiKey: "apiKey",
            headers: {
              "x-elastic-client-meta": `ent=${LIB_VERSION}-es-connector,js=browser,t=${LIB_VERSION}-es-connector,ft=universal`
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
