import React from "react";
import { mount } from "enzyme";

import { SearchContext } from "..";
import { withSearch } from "..";
import { SearchDriver } from "@elastic/search-ui";
import { SearchContextState } from "../withSearch";

describe("withSearch", () => {
  let mockDriver: SearchDriver;
  let callback;

  beforeEach(() => {
    mockDriver = new SearchDriver({ apiConnector: null });

    mockDriver.state = {
      ...mockDriver.state,
      searchTerm: "a search term",
      resultSearchTerm: "another search term"
    };

    jest
      .spyOn(mockDriver.actions, "setSearchTerm")
      .mockImplementation(function setSearchTerm(searchTerm) {
        callback({
          searchTerm
        });
      });

    jest
      .spyOn(mockDriver, "subscribeToStateChanges")
      .mockImplementation((cb) => {
        callback = cb;
      });

    jest
      .spyOn(mockDriver, "unsubscribeToStateChanges")
      .mockImplementation(() => ({}));
  });

  describe("driver subscription", () => {
    function setup(mapContextToProps) {
      const Component = withSearch(mapContextToProps)(({ searchTerm }) => {
        return <div>{searchTerm}</div>;
      });

      return mount(
        <SearchContext.Provider value={{ driver: mockDriver }}>
          <Component />
        </SearchContext.Provider>
      );
    }

    it("will subscribe to state updates", () => {
      const element = setup((c) => c);
      mockDriver.getActions().setSearchTerm("New Term");
      expect(element.text()).toEqual("New Term");
    });

    it("will maintain action properties on state updates when mapContextToProps parameter is passed", () => {
      const element = setup(({ searchTerm, setSearchTerm }) => ({
        searchTerm,
        setSearchTerm
      }));
      mockDriver.getActions().setSearchTerm("New Term");
      expect(element.text()).toEqual("New Term");
    });

    it("will unsubsribe on unmount", () => {
      const element = setup((c) => c);
      element.unmount();
      expect(
        (mockDriver.unsubscribeToStateChanges as jest.Mock).mock.calls.length
      ).toEqual(1);
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

    it("will use mapContextToProps on state update", () => {
      const element = setup(({ searchTerm }) => ({
        searchTerm: searchTerm + " (updated)"
      }));
      mockDriver.getActions().setSearchTerm("a new search term");
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

    it("will use the mapContextToProps override on state update", () => {
      const element = setup(
        () => ({}),
        ({ searchTerm }) => ({
          searchTerm: searchTerm + " (updated)"
        })
      );
      mockDriver.getActions().setSearchTerm("a new search term");
      expect(element.text()).toEqual("a new search term (updated)");
    });
  });
});
