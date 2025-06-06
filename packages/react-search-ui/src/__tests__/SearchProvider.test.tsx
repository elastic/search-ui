import React from "react";
import { render, screen } from "@testing-library/react";

import { SearchProvider, WithSearch } from "../";
import { APIConnector, SearchDriver } from "@elastic/search-ui";
import type { AutocompleteQueryConfig } from "@elastic/search-ui";

function getMocks() {
  const mockApiConnector: APIConnector = {
    onSearch: jest.fn(),
    onAutocomplete: jest.fn(),
    onResultClick: jest.fn(),
    onAutocompleteResultClick: jest.fn()
  };

  const driver = new SearchDriver({
    apiConnector: mockApiConnector
  });

  const mockedDriver = Object.assign(driver, {
    tearDown: jest.fn(),
    setSearchQuery: jest.fn(),
    setAutocompleteQuery: jest.fn()
  });

  return {
    apiConnector: mockApiConnector,
    driver: mockedDriver
  };
}

describe("SearchProvider", () => {
  it("will clean up searchDriver on unmount", () => {
    const { driver, apiConnector } = getMocks();
    const { unmount } = render(
      <SearchProvider driver={driver} config={{ apiConnector }}>
        <div></div>
      </SearchProvider>
    );
    expect(driver.tearDown).not.toHaveBeenCalled();

    unmount();
    expect(driver.tearDown).toHaveBeenCalled();
  });

  it("will update searchDriver when searchQuery config changes", () => {
    const originalSearchQueryConfig = {
      facets: { states: { type: "value", size: 30 } }
    };
    const updatedSearchQueryConfig = {};

    const { driver, apiConnector } = getMocks();
    const { rerender } = render(
      <SearchProvider
        driver={driver}
        config={{
          apiConnector: apiConnector,
          searchQuery: originalSearchQueryConfig
        }}
      >
        <div>test</div>
      </SearchProvider>
    );
    expect(driver.setSearchQuery).not.toHaveBeenCalled();

    rerender(
      <SearchProvider
        driver={driver}
        config={{
          apiConnector: apiConnector,
          searchQuery: updatedSearchQueryConfig
        }}
      >
        <div>test</div>
      </SearchProvider>
    );

    expect(driver.setSearchQuery).toHaveBeenCalledWith(
      updatedSearchQueryConfig
    );
    expect(driver.setAutocompleteQuery).not.toHaveBeenCalled();
  });

  it("will update searchDriver when autocompleteQuery config changes", () => {
    const autocompleteQueryConfig: AutocompleteQueryConfig = {
      results: { result_fields: { states: { snippet: { size: 30 } } } }
    };
    const updatedAutocompleteQueryConfig = {};

    const { driver, apiConnector } = getMocks();
    const { rerender } = render(
      <SearchProvider
        driver={driver}
        config={{
          apiConnector: apiConnector,
          autocompleteQuery: autocompleteQueryConfig
        }}
      >
        <div>test</div>
      </SearchProvider>
    );
    expect(driver.setAutocompleteQuery).not.toHaveBeenCalled();

    rerender(
      <SearchProvider
        driver={driver}
        config={{
          apiConnector: apiConnector,
          autocompleteQuery: updatedAutocompleteQueryConfig
        }}
      >
        <div>test</div>
      </SearchProvider>
    );

    expect(driver.setAutocompleteQuery).toHaveBeenCalledWith(
      updatedAutocompleteQueryConfig
    );
    expect(driver.setSearchQuery).not.toHaveBeenCalled();
  });

  it("exposes state and actions to components", () => {
    const { apiConnector } = getMocks();

    render(
      <SearchProvider
        config={{
          apiConnector: apiConnector,
          initialState: {
            searchTerm: "test"
          },
          onSearch: () => {
            return Promise.resolve({
              results: [],
              facets: {},
              pagingStart: 0,
              pagingEnd: 100,
              rawResponse: {},
              requestId: "1",
              resultSearchTerm: "test",
              totalPages: 100,
              totalResults: 1000,
              wasSearched: true
            });
          }
        }}
      >
        <WithSearch
          mapContextToProps={({ searchTerm, setSearchTerm }) => ({
            searchTerm,
            setSearchTerm
          })}
        >
          {({ searchTerm, setSearchTerm }) => (
            <div>
              {searchTerm}
              {typeof setSearchTerm}
            </div>
          )}
        </WithSearch>
      </SearchProvider>
    );

    expect(screen.getByText("testfunction")).toBeInTheDocument();
  });
});
