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
      const configuration = buildConfiguration(
        state,
        queryConfig,
        host,
        index,
        apiKey
      );

      const validHeaderRegex =
        // eslint-disable-next-line no-useless-escape
        /^[a-z]{1,}=[a-z0-9\.\-]{1,}(?:,[a-z]{1,}=[a-z0-9\.\-]+)*$/;
      expect(
        configuration.connectionOptions.headers["x-elastic-client-meta"]
      ).toMatch(validHeaderRegex);

      expect(
        configuration.connectionOptions.headers["x-elastic-client-meta"]
      ).toEqual(
        `ent=${LIB_VERSION}-es-connector,js=${nodeVersion},t=${LIB_VERSION}-es-connector,ft=universal`
      );
    });
  });
});
