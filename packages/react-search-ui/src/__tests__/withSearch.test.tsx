/* eslint-disable jest/no-focused-tests */
import React from "react";
import { act } from "react-dom/test-utils";
import { mount } from "enzyme";

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

      const wrapper = mount(
        <SearchContext.Provider value={{ driver: mockDriver }}>
          <Component />
        </SearchContext.Provider>
      );

      return {
        wrapper,
        Component
      };
    }

    it("will subscribe to state updates", async () => {
      const { wrapper } = setup((c) => c);

      await act(() => {
        mockDriver.getActions().setSearchTerm("New Term");
      });
      wrapper.update();

      expect(wrapper.text()).toEqual("New Term");
    });

    it("will maintain action properties on state updates when mapContextToProps parameter is passed", async () => {
      const { wrapper } = setup(({ searchTerm, setSearchTerm }) => ({
        searchTerm,
        setSearchTerm
      }));

      await act(() => {
        mockDriver.getActions().setSearchTerm("New Term");
      });
      wrapper.update();

      expect(wrapper.text()).toEqual("New Term");
    });

    it("will unsubsribe on unmount", () => {
      console.error = jest.fn();

      const { wrapper } = setup(({ searchTerm, setSearchTerm }) => ({
        searchTerm,
        setSearchTerm
      }));
      expect(mockDriver.subscriptions).toHaveLength(1);
      wrapper.unmount();
      expect(
        mockDriver.unsubscribeToStateChanges as jest.Mock
      ).toHaveBeenCalledTimes(1);

      expect(mockDriver.subscriptions).toHaveLength(0);
      mockDriver.getActions().setSearchTerm("New Term");
      expect(console.error).not.toBeCalled();
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

      return mount(
        <SearchContext.Provider value={{ driver: mockDriver }}>
          <Component prop1="prop 1 value" />
        </SearchContext.Provider>
      );
    }

    it("will inject specified state", () => {
      const element = setup(({ searchTerm }) => ({ searchTerm }));

      expect(element.text()).toEqual("a search term");
    });

    it("will inject a specified action", () => {
      const element = setup(({ setSearchTerm }) => ({ setSearchTerm }));

      expect(element.text()).toEqual("mockConstructor");
    });

    it("will not inject an  unspecified state", () => {
      const element = setup(({ resultSearchTerm }) => ({ resultSearchTerm }));

      expect(element.text()).toEqual("another search term");
    });

    it("will inject arbitrary state", () => {
      const element = setup(() => ({ clap: "your hands" }));

      expect(element.text()).toEqual("your hands");
    });

    it("will error if nothing is passed", () => {
      expect(() => setup()).toThrow();
    });

    it("will inject nothing if the function injects nothing", () => {
      const element = setup(() => ({}));

      expect(element.text()).toEqual("");
    });

    it("accepts the current props as a second parameter", () => {
      const element = setup((_, { prop1 }) => ({ searchTerm: prop1 }));

      expect(element.text()).toEqual("prop 1 value");
    });

    it("will use mapContextToProps on state update", async () => {
      const element = setup(({ searchTerm }) => ({
        searchTerm: searchTerm + " (updated)"
      }));

      await act(async () => {
        mockDriver.getActions().setSearchTerm("a new search term");
      });

      expect(element.text()).toEqual("a new search term (updated)");
    });
  });

  describe("mapContextToProps override", () => {
    function setup(initialMapContextToProps, mapContextToProps) {
      const Component = withSearch(initialMapContextToProps)(
        ({ clap, searchTerm }) => {
          return (
            <div>
              {searchTerm}
              {clap}
            </div>
          );
        }
      );

      return mount(
        <SearchContext.Provider value={{ driver: mockDriver }}>
          <Component mapContextToProps={mapContextToProps} />
        </SearchContext.Provider>
      );
    }

    it("should allow a component level prop that overrides mapContextToProps from setup", () => {
      const element = setup(
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
      expect(element.text()).toEqual("a search term is now modified");
    });

    it("will use the mapContextToProps override on state update", async () => {
      const element = setup(
        () => ({}),
        ({ searchTerm }) => ({
          searchTerm: searchTerm + " (updated)"
        })
      );

      await act(async () => {
        mockDriver.getActions().setSearchTerm("a new search term");
      });

      expect(element.text()).toEqual("a new search term (updated)");
    });
  });
});
