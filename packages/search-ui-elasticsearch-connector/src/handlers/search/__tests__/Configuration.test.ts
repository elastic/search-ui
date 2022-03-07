import {
  FieldConfiguration,
  QueryConfig,
  RequestState
} from "@elastic/search-ui";
import buildConfiguration, { getResultFields } from "../Configuration";
jest.mock("@searchkit/sdk");
import { MultiMatchQuery, RefinementSelectFacet } from "@searchkit/sdk";

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
        hitFields: ["title", "url"],
        highlightFields: ["title", "description"]
      });
    });
  });

  describe("buildConfiguration", () => {
    const queryConfig: QueryConfig = {
      result_fields: {
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
      },
      facets: {
        category: {
          type: "value",
          size: 20
        },
        type: {
          type: "value",
          size: 20
        }
      },
      disjunctiveFacets: ["category"]
    };
    const host = "http://localhost:9200";
    const index = "test_index";
    const apiKey = "apiKey";
    const queryFields = ["title", "description"];

    it("builds configuration", () => {
      const state: RequestState = {
        searchTerm: "test"
      };

      expect(
        buildConfiguration(state, queryConfig, host, index, apiKey, queryFields)
      ).toEqual(
        expect.objectContaining({
          host: "http://localhost:9200",
          index: "test_index",
          connectionOptions: {
            apiKey: "apiKey"
          },
          hits: {
            fields: ["title", "url"],
            highlightedFields: ["title", "description"]
          }
        })
      );

      expect(MultiMatchQuery).toHaveBeenCalledWith({
        fields: ["title", "description"]
      });

      expect(RefinementSelectFacet).toHaveBeenCalledTimes(2);
      expect(RefinementSelectFacet).toHaveBeenCalledWith({
        identifier: "category",
        field: "category",
        label: "category",
        size: 20,
        multipleSelect: true
      });
      expect(RefinementSelectFacet).toHaveBeenCalledWith({
        identifier: "type",
        field: "type",
        label: "type",
        size: 20,
        multipleSelect: false
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
          apiKey,
          queryFields
        )
      ).toEqual(
        expect.objectContaining({
          host: "http://localhost:9200",
          index: "test_index",
          connectionOptions: {
            apiKey: "apiKey"
          },
          hits: {
            fields: ["title", "url"],
            highlightedFields: ["title", "description"]
          }
        })
      );

      expect(MultiMatchQuery).toHaveBeenCalledWith({
        fields: ["title", "description"]
      });

      expect(RefinementSelectFacet).toHaveBeenCalledTimes(2);
      expect(RefinementSelectFacet).toHaveBeenCalledWith({
        identifier: "category",
        field: "category",
        label: "category",
        size: 20,
        multipleSelect: true
      });
      expect(RefinementSelectFacet).toHaveBeenCalledWith({
        identifier: "type",
        field: "type",
        label: "type",
        size: 20,
        multipleSelect: false
      });
    });
  });
});
