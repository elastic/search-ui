import { searchResponse, searchResponseWithoutFacets } from "../test/fixtures";

import SearchDriver from "../SearchDriver";

export function getMockApiConnector() {
  return {
    search: jest.fn().mockReturnValue({ then: cb => cb(searchResponse) }),
    click: jest.fn().mockReturnValue({ then: () => {} })
  };
}

export function setupDriver({
  initialState,
  mockSearchResponse,
  trackUrlState = true
} = {}) {
  const mockApiConnector = getMockApiConnector();
  mockApiConnector.search = jest
    .fn()
    .mockReturnValue({ then: cb => cb(searchResponse) });
  mockApiConnector.click = jest.fn().mockReturnValue({ then: () => {} });

  const driver = new SearchDriver({
    apiConnector: mockApiConnector,
    trackUrlState,
    initialState,
    // We don't want to deal with async in our tests, so pass 0 so URL state
    // pushes happen synchronously
    urlPushDebounceLength: 0
  });

  if (mockSearchResponse) {
    mockApiConnector.search = jest
      .fn()
      .mockReturnValue({ then: cb => cb(searchResponseWithoutFacets) });
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
    !!requestId &&
    results.length &&
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
  return mockApiConnector.search.mock.calls;
}
