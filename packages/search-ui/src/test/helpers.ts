import SearchDriver, { SearchDriverOptions } from "../SearchDriver";
import { APIConnector, Filter, SearchState } from "../types";

export type SubjectArguments = {
  initialState?: Partial<SearchState>;
  initialFilters?: Filter[];
  autocompleteResults?: boolean;
  autocompleteSuggestions?: boolean;
  refresh?: boolean;
  shouldClearFilters?: boolean;
};

const suggestions = {
  documents: [
    {
      suggestion: "carlsbad"
    },
    {
      suggestion: "carlsbad caverns"
    },
    {
      suggestion: "carolina"
    }
  ]
};

const searchResponse = {
  totalResults: 1000,
  totalPages: 100,
  requestId: "12345",
  facets: {},
  results: [{}, {}]
};

const autocompleteSearchResponse = {
  requestId: "6789",
  results: [{}, {}]
};

export function getMockApiConnector() {
  return {
    onAutocomplete: jest.fn().mockReturnValue({
      then: (cb) =>
        cb({
          autocompletedResults: autocompleteSearchResponse.results,
          autocompletedResultsRequestId: autocompleteSearchResponse.requestId,
          autocompletedSuggestions: suggestions
        })
    }),
    onSearch: jest.fn().mockReturnValue({ then: (cb) => cb(searchResponse) }),
    onResultClick: jest.fn().mockReturnValue(Promise.resolve(true)),
    onAutocompleteResultClick: jest.fn().mockReturnValue(Promise.resolve(true))
  };
}

type SetupDriverOptions = {
  mockSearchResponse?: any; //eslint-disable-line @typescript-eslint/no-explicit-any
  mockApiConnector?: APIConnector;
} & Partial<SearchDriverOptions>;

export function setupDriver(
  { mockSearchResponse, mockApiConnector, ...rest }: SetupDriverOptions = {
    mockSearchResponse: null,
    mockApiConnector: null
  }
): {
  driver: SearchDriver;
  stateAfterCreation: any; //eslint-disable-line @typescript-eslint/no-explicit-any
  updatedStateAfterAction: any; //eslint-disable-line @typescript-eslint/no-explicit-any
  mockApiConnector: APIConnector;
} {
  mockApiConnector = mockApiConnector || getMockApiConnector();

  if (mockSearchResponse) {
    mockApiConnector.onSearch = jest.fn().mockReturnValue({
      then: (cb) => cb(mockSearchResponse)
    });
  }

  const driver = new SearchDriver({
    apiConnector: mockApiConnector,
    initialState: null,
    // Pass, e.g., initialState and all other configs
    ...rest,
    // We don't want to deal with async in our tests, so pass 0 so URL state
    // pushes happen synchronously
    urlPushDebounceLength: 0
  });

  const updatedStateAfterAction = { state: null };
  driver.subscribeToStateChanges((newState) => {
    updatedStateAfterAction.state = newState;
  });

  jest.runAllTimers();

  return {
    stateAfterCreation: driver.getState(),
    driver,
    updatedStateAfterAction,
    mockApiConnector
  };
}

export function doesStateHaveResponseData(response) {
  const { requestId, results, totalPages, totalResults, wasSearched } =
    response;
  return (
    !!results &&
    results.length &&
    !!requestId &&
    totalPages > 0 &&
    totalResults > 0 &&
    !!wasSearched
  );
}

export function getSearchCalls(mockApiConnector) {
  return mockApiConnector.onSearch.mock.calls;
}

export function getAutocompleteCalls(mockApiConnector) {
  return mockApiConnector.onAutocomplete.mock.calls;
}

export function getClickCalls(mockApiConnector) {
  return mockApiConnector.onResultClick.mock.calls;
}

export function getAutocompleteClickCalls(mockApiConnector) {
  return mockApiConnector.onAutocompleteResultClick.mock.calls;
}

/**
 * Returns a promise that resolves after the current event loop.
 *
 * Useful for writing `await waitATick()` to wait for a promise to resolve.
 */
export function waitATick() {
  let promiseResolve;
  const promise = new Promise((resolve) => (promiseResolve = resolve));
  setTimeout(() => promiseResolve());
  jest.runAllTimers();
  return promise;
}
