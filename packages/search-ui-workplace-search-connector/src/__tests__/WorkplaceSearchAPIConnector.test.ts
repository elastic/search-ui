import WorkplaceSearchAPIConnector from "..";
import type {
  SearchQueryHook,
  SuggestionsQueryHook,
  WorkplaceSearchAPIConnectorParams
} from "../WorkplaceSearchAPIConnector";
import type {
  QueryConfig,
  SearchState,
  AutocompleteQuery
} from "@elastic/search-ui";
import { DEFAULT_STATE } from "@elastic/search-ui";
import exampleResponse from "./exampleResponse.json";
import { adaptResponse } from "../responseAdapter";

jest.mock("../responseAdapter");

(window as any).fetch = jest.fn();
(window as any).fetch.mockReturnValue({
  status: 200,
  json: jest.fn().mockReturnValue(exampleResponse)
});

beforeEach(() => {
  jest.clearAllMocks();
});

type AnalyticsEvent = {
  query: string;
  documentId: string;
  requestId: string;
  tags: string[];
};

function getLastFetchCall() {
  const lastFetchCall = (
    (window as any).fetch as jest.MockedFn<(url, body) => any>
  ).mock.calls[0];
  const [url, body] = lastFetchCall;
  return {
    url,
    body: JSON.parse(body.body) as AnalyticsEvent,
    token: body.headers.Authorization
  };
}

const params: WorkplaceSearchAPIConnectorParams = {
  kibanaBase: "https://search-ui-sandbox.kb.us-central1.gcp.cloud.es.io:9243",
  enterpriseSearchBase:
    "https://search-ui-sandbox.ent.us-central1.gcp.cloud.es.io",
  redirectUri: "http://localhost:3000",
  clientId: "8e495e40fc1e6acf515e557e534de39d4f727f7f60a3afed24a99ce3a6607c1e"
};

describe("WorkplaceSearchAPIConnector", () => {
  it("can be initialized", () => {
    const connector = new WorkplaceSearchAPIConnector(params);
    expect(connector).toBeInstanceOf(WorkplaceSearchAPIConnector);
  });

  it("will throw when missing required parameters", () => {
    expect(() => {
      new WorkplaceSearchAPIConnector({} as any);
    }).toThrow();
  });

  describe("Result click Analytics Event", () => {
    function subject() {
      const connector = new WorkplaceSearchAPIConnector({
        ...params
      });

      return connector.onResultClick({
        documentId: "11111",
        requestId: "12345",
        page: 1,
        result: exampleResponse.results[0]
      });
    }

    it("passes documentId and queryId to the click endpoint", () => {
      subject();
      const { body } = getLastFetchCall();
      expect(body).toMatchInlineSnapshot(`
        Object {
          "content_source_id": "621581b6174a804659f9dc16",
          "document_id": "11111",
          "page": 1,
          "query_id": "12345",
          "type": "click",
        }
      `);
    });
  });

  describe("onSearch", () => {
    function subject(
      state: SearchState = { ...DEFAULT_STATE },
      queryConfig: QueryConfig = {},
      beforeSearchCall?: SearchQueryHook
    ) {
      if (!state.searchTerm) state.searchTerm = "searchTerm";

      const connector = new WorkplaceSearchAPIConnector({
        ...params,
        beforeSearchCall
      });

      return connector.onSearch(state, queryConfig);
    }

    it("will throw an error if there is no accessToken in localstorage or in url", async () => {
      await expect(subject()).rejects.toThrow();
      expect(fetch).not.toHaveBeenCalled();
      expect(adaptResponse).not.toHaveBeenCalled();
    });

    it("will issue a request if access token is in the localstorage", async () => {
      localStorage.setItem("SearchUIWorkplaceSearchAccessToken", "faketoken");

      await subject();
      expect(fetch).toHaveBeenCalledTimes(1);
      expect(adaptResponse).toHaveBeenCalledTimes(1);
    });

    it("will issue a request if access token is in the url", async () => {
      const mockUrl = new URL(window.location.href);
      mockUrl.hash = "access_token=faketoken";
      window.location.href = mockUrl.href;

      await subject();
      expect(fetch).toHaveBeenCalledTimes(1);
      expect(adaptResponse).toHaveBeenCalledTimes(1);
    });
  });

  describe("onAutocomplete", () => {
    function subject(
      state: SearchState = { ...DEFAULT_STATE },
      queryConfig: AutocompleteQuery = {},
      {
        beforeAutocompleteResultsCall,
        beforeAutocompleteSuggestionsCall
      }: {
        beforeAutocompleteResultsCall?: SearchQueryHook;
        beforeAutocompleteSuggestionsCall?: SuggestionsQueryHook;
      } = {}
    ) {
      if (!state.searchTerm) state.searchTerm = "searchTerm";

      const connector = new WorkplaceSearchAPIConnector({
        ...params,
        beforeAutocompleteResultsCall,
        beforeAutocompleteSuggestionsCall
      });

      return connector.onAutocomplete(state, queryConfig);
    }

    describe("when 'results' type is requested", () => {
      it("will issue a request even if there is no accessToken in localstorage or in url", async () => {
        subject({ ...DEFAULT_STATE }, { results: {} });
        expect(fetch).toHaveBeenCalledTimes(1);
      });

      it("will issue a request if access token is in the localstorage", async () => {
        localStorage.setItem("SearchUIWorkplaceSearchAccessToken", "faketoken");

        await subject({ ...DEFAULT_STATE }, { results: {} });
        expect(fetch).toHaveBeenCalledTimes(1);
      });

      it("will issue a request if access token is in the url", async () => {
        const mockUrl = new URL(window.location.href);
        mockUrl.hash = "access_token=faketoken";
        window.location.href = mockUrl.href;

        await subject({ ...DEFAULT_STATE }, { results: {} });
        expect(fetch).toHaveBeenCalledTimes(1);
      });
    });

    describe("Autocomplete Analytics Event", () => {
      function subject() {
        const connector = new WorkplaceSearchAPIConnector({
          ...params
        });

        return connector.onAutocompleteResultClick({
          documentId: "11111",
          requestId: "12345",
          result: exampleResponse.results[0]
        });
      }

      it("passes documentId and queryId to the autocomplete click endpoint", () => {
        subject();
        const { body } = getLastFetchCall();
        expect(body).toMatchInlineSnapshot(`
          Object {
            "content_source_id": "621581b6174a804659f9dc16",
            "document_id": "11111",
            "page": 1,
            "query_id": "12345",
            "type": "click",
          }
        `);
      });
    });
  });
});
