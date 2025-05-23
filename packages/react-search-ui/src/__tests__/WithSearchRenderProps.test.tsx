import React from "react";
import { render, screen } from "@testing-library/react";

import { SearchProvider, WithSearch } from "../";
import type { APIConnector } from "@elastic/search-ui";

describe("WithSearch", () => {
  const mockResponse = {
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
  };

  const mockApiConnector: APIConnector = {
    onSearch: jest.fn(),
    onAutocomplete: jest.fn(),
    onResultClick: jest.fn(),
    onAutocompleteResultClick: jest.fn()
  };

  it("exposes state and actions to components", () => {
    render(
      <SearchProvider
        config={{
          apiConnector: mockApiConnector,
          initialState: {
            searchTerm: "test"
          },
          onSearch: () => {
            return Promise.resolve(mockResponse);
          }
        }}
      >
        <WithSearch mapContextToProps={({ searchTerm }) => ({ searchTerm })}>
          {({ searchTerm }) => <div>{searchTerm}</div>}
        </WithSearch>
      </SearchProvider>
    );
    expect(screen.getByText("test")).toBeInTheDocument();
  });

  describe("mapContextToProps", () => {
    function setup(mapContextToProps) {
      return render(
        <SearchProvider
          config={{
            apiConnector: mockApiConnector,
            initialState: {
              resultsPerPage: 90,
              searchTerm: "test"
            },
            onSearch: () => {
              return Promise.resolve(mockResponse);
            }
          }}
        >
          <WithSearch mapContextToProps={mapContextToProps}>
            {({ searchTerm, resultsPerPage, setResultsPerPage }) => (
              <div>
                {searchTerm}
                {resultsPerPage}
                {setResultsPerPage && typeof setResultsPerPage}
              </div>
            )}
          </WithSearch>
        </SearchProvider>
      );
    }

    it("can inject state", () => {
      const mapContextToProps = ({ resultsPerPage }) => ({
        resultsPerPage
      });
      setup(mapContextToProps);
      expect(screen.getByText("90")).toBeInTheDocument();
    });

    it("can inject actions", () => {
      const mapContextToProps = ({ setResultsPerPage }) => ({
        setResultsPerPage
      });
      setup(mapContextToProps);
      expect(screen.getByText("function")).toBeInTheDocument();
    });
  });
});
