import React, { act } from "react";
import { render, screen } from "@testing-library/react";

import { SearchContext } from "..";
import { withSearch } from "..";
import { SearchDriver } from "@elastic/search-ui";
import { SearchContextState } from "../withSearch";

describe("withSearch", () => {
  let mockDriver: SearchDriver;

  beforeEach(() => {
    mockDriver = new SearchDriver({
      apiConnector: null,
      onSearch: jest.fn(() =>
        Promise.resolve({
          requestId: "mock-request-id",
          facets: {},
          resultSearchTerm: "mock-search-term",
          totalPages: 1,
          totalResults: 10,
          pagingStart: 1,
          pagingEnd: 10,
          wasSearched: true,
          results: [
            { id: "1", title: { raw: "Result 1" } },
            { id: "2", title: { raw: "Result 2" } }
          ],
          rawResponse: {}
        })
      )
    });

    mockDriver.state = {
      ...mockDriver.state,
      searchTerm: "a search term",
      resultSearchTerm: "another search term"
    };

    jest.spyOn(mockDriver.actions, "setSearchTerm");

    jest.spyOn(mockDriver, "subscribeToStateChanges");

    jest.spyOn(mockDriver, "unsubscribeToStateChanges");
  });

  describe("driver subscription", () => {
    function setup(mapContextToProps) {
      const Component = withSearch(mapContextToProps)(({ searchTerm }) => {
        return <div>{searchTerm}</div>;
      });

      return render(
        <SearchContext.Provider value={{ driver: mockDriver }}>
          <Component />
        </SearchContext.Provider>
      );
    }

    it("will subscribe to state updates", async () => {
      setup((c) => c);

      await act(() => {
        mockDriver.getActions().setSearchTerm("New Term");
      });

      expect(screen.getByText("New Term")).toBeInTheDocument();
    });

    it("will maintain action properties on state updates when mapContextToProps parameter is passed", async () => {
      setup(({ searchTerm, setSearchTerm }) => ({
        searchTerm,
        setSearchTerm
      }));

      await act(() => {
        mockDriver.getActions().setSearchTerm("New Term");
      });

      expect(screen.getByText("New Term")).toBeInTheDocument();
    });

    it("will unsubsribe on unmount", () => {
      console.error = jest.fn();

      const { unmount } = setup(({ searchTerm, setSearchTerm }) => ({
        searchTerm,
        setSearchTerm
      }));
      expect(mockDriver.subscriptions).toHaveLength(1);
      unmount();
      expect(
        mockDriver.unsubscribeToStateChanges as jest.Mock
      ).toHaveBeenCalledTimes(1);

      expect(mockDriver.subscriptions).toHaveLength(0);
      mockDriver.getActions().setSearchTerm("New Term");
      expect(console.error).not.toHaveBeenCalled();
    });
  });

  describe("mapContextToProps", () => {
    function setup(mapContextToProps?) {
      type ComponentViewProps = {
        prop1: string;
      };

      type ComponentContext = Pick<
        SearchContextState,
        "searchTerm" | "resultSearchTerm" | "setSearchTerm"
      >;

      const Component = withSearch<ComponentViewProps, ComponentContext>(
        mapContextToProps
      )(({ searchTerm, resultSearchTerm, setSearchTerm, clap }) => {
        return (
          <div>
            {searchTerm}
            {resultSearchTerm}
            {setSearchTerm && setSearchTerm.name}
            {clap}
          </div>
        );
      });

      return render(
        <SearchContext.Provider value={{ driver: mockDriver }}>
          <Component prop1="prop 1 value" />
        </SearchContext.Provider>
      );
    }

    it("will inject specified state", () => {
      setup(({ searchTerm }) => ({ searchTerm }));
      expect(screen.getByText("a search term")).toBeInTheDocument();
    });

    it("will inject a specified action", () => {
      setup(({ setSearchTerm }) => ({ setSearchTerm }));
      expect(screen.getByText("mockConstructor")).toBeInTheDocument();
    });

    it("will not inject an  unspecified state", () => {
      setup(({ resultSearchTerm }) => ({ resultSearchTerm }));
      expect(screen.getByText("another search term")).toBeInTheDocument();
    });

    it("will inject arbitrary state", () => {
      setup(() => ({ clap: "your hands" }));
      expect(screen.getByText("your hands")).toBeInTheDocument();
    });

    it("will error if nothing is passed", () => {
      expect(() => setup()).toThrow();
    });

    it("will inject nothing if the function injects nothing", () => {
      const { container } = setup(() => ({}));
      expect(container.innerHTML).toBe("<div></div>");
    });

    it("accepts the current props as a second parameter", () => {
      setup((_, { prop1 }) => ({ searchTerm: prop1 }));
      expect(screen.getByText("prop 1 value")).toBeInTheDocument();
    });

    it("will use mapContextToProps on state update", async () => {
      setup(({ searchTerm }) => ({
        searchTerm: searchTerm + " (updated)"
      }));

      await act(async () => {
        mockDriver.getActions().setSearchTerm("a new search term");
      });

      expect(
        screen.getByText("a new search term (updated)")
      ).toBeInTheDocument();
    });
  });

  describe("mapContextToProps override", () => {
    function setup(initialMapContextToProps, mapContextToProps) {
      const Component = withSearch(initialMapContextToProps)(({
        clap,
        searchTerm
      }) => {
        return (
          <div>
            {searchTerm}
            {clap}
          </div>
        );
      });

      return render(
        <SearchContext.Provider value={{ driver: mockDriver }}>
          <Component mapContextToProps={mapContextToProps} />
        </SearchContext.Provider>
      );
    }

    it("should allow a component level prop that overrides mapContextToProps from setup", () => {
      setup(
        () => {
          return {
            clap: "your hands"
          };
        },
        ({ searchTerm }) => {
          return {
            searchTerm: searchTerm + " is now modified"
          };
        }
      );
      expect(
        screen.getByText("a search term is now modified")
      ).toBeInTheDocument();
    });

    it("will use the mapContextToProps override on state update", async () => {
      setup(
        () => ({}),
        ({ searchTerm }) => ({
          searchTerm: searchTerm + " (updated)"
        })
      );

      await act(async () => {
        mockDriver.getActions().setSearchTerm("a new search term");
      });

      expect(
        screen.getByText("a new search term (updated)")
      ).toBeInTheDocument();
    });
  });
});
