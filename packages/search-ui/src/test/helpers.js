import SearchDriver from "../SearchDriver";

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
      then: cb =>
        cb({
          autocompletedResults: autocompleteSearchResponse.results,
          autocompletedResultsRequestId: autocompleteSearchResponse.requestId,
          autocompletedSuggestions: suggestions
        })
    }),
    onSearch: jest.fn().mockReturnValue({ then: cb => cb(searchResponse) }),
    onResultClick: jest.fn().mockReturnValue({ then: () => {} }),
    onAutocompleteResultClick: jest.fn().mockReturnValue({ then: () => {} })
  };
}

export function setupDriver({
  initialState,
  mockSearchResponse,
  trackUrlState
} = {}) {
  const mockApiConnector = getMockApiConnector();

  trackUrlState =
    trackUrlState === false || trackUrlState === true ? trackUrlState : true;

  const driver = new SearchDriver({
    apiConnector: mockApiConnector,
    trackUrlState,
    initialState,
    // We don't want to deal with async in our tests, so pass 0 so URL state
    // pushes happen synchronously
    urlPushDebounceLength: 0
  });

  if (mockSearchResponse) {
    mockApiConnector.search = jest.fn().mockReturnValue({
      then: cb => cb(mockSearchResponse)
    });
  }

  const updatedStateAfterAction = {};
  driver.subscribeToStateChanges(newState => {
    updatedStateAfterAction.state = newState;
  });

  return {
    stateAfterCreation: driver.getState(),
    driver,
    updatedStateAfterAction,
    mockApiConnector
  };
}

export function doesStateHaveResponseData(response) {
  const {
    requestId,
    results,
    totalPages,
    totalResults,
    wasSearched
  } = response;
  return (
    !!results &&
    results.length &&
    !!requestId &&
    totalPages > 0 &&
    totalResults > 0 &&
    !!wasSearched
  );
}

export function waitABit(length) {
  return new Promise(function(resolve) {
    setTimeout(() => resolve(), length);
  });
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
