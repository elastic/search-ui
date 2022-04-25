/**
 * @jest-environment node
 */

import { QueryConfig, RequestState } from "@elastic/search-ui";
import buildConfiguration from "../Configuration";
jest.mock("@searchkit/sdk");

import { LIB_VERSION } from "../../../version";

describe("Search - Configuration within node context", () => {
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

      const nodeVersion = process.version;

      expect(
        buildConfiguration(state, queryConfig, host, index, apiKey)
      ).toEqual(
        expect.objectContaining({
          host: "http://localhost:9200",
          index: "test_index",
          connectionOptions: {
            apiKey: "apiKey",
            headers: {
              "x-elastic-client-meta": `ent=${LIB_VERSION}-es-connector,js=${nodeVersion},t=${LIB_VERSION}-es-connector,ft=universal`
            }
          },
          hits: {
            fields: ["title", "description", "url"],
            highlightedFields: ["title", "description"]
          }
        })
      );
    });
  });
});
