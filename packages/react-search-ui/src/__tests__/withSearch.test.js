import React from "react";
import { mount } from "enzyme";

import { SearchContext } from "..";
import { withSearch } from "..";

describe("withSearch", () => {
  let mockDriver;
  let callback;

  beforeEach(() => {
    mockDriver = {
      getState: () => ({
        searchTerm: "a search term",
        resultSearchTerm: "another search term"
      }),
      getActions: () => ({
        setSearchTerm: searchTerm => {
          callback({
            searchTerm
          });
        }
      }),
      subscribeToStateChanges: cb => {
        callback = cb;
      },
      unsubscribeToStateChanges: jest.fn()
    };
  });

  describe("mapContextToProps", () => {
    function setup(uses, mapContextToProps) {
      const Component = withSearch(uses, ({ clap, searchTerm }) => {
        return (
          <div>
            {searchTerm}
            {clap}
          </div>
        );
      });

      return mount(
        <SearchContext.Provider value={{ driver: mockDriver }}>
          <Component mapContextToProps={mapContextToProps} />
        </SearchContext.Provider>
      );
    }

    it("should allow a new value to be injecting into a component", () => {
      const element = setup([], ({ searchTerm }) => {
        return {
          searchTerm: searchTerm + " New Term"
        };
      });
      expect(element.text()).toEqual("a search term New Term");
    });

    it("should not have access to values that not specified in the 'uses' parameter", () => {
      const element = setup(["resultSearchTerm"], ({ searchTerm }) => {
        return {
          searchTerm: searchTerm + " New Term"
        };
      });
      expect(element.text()).toEqual("undefined New Term");
    });

    it("should allow a brand new values to be injected", () => {
      const element = setup([], () => {
        return {
          clap: "your hands"
        };
      });
      expect(element.text()).toEqual("your hands");
    });
  });

  describe("driver subscription", () => {
    function setup() {
      const Component = withSearch([], ({ searchTerm }) => {
        return <div>{searchTerm}</div>;
      });

      return mount(
        <SearchContext.Provider value={{ driver: mockDriver }}>
          <Component />
        </SearchContext.Provider>
      );
    }

    it("will subscribe to state updates", () => {
      const element = setup();
      mockDriver.getActions().setSearchTerm("New Term");
      expect(element.text()).toEqual("New Term");
    });

    it("will unsubsribe on unmount", () => {
      const element = setup();
      element.unmount();
      expect(mockDriver.unsubscribeToStateChanges.mock.calls.length).toEqual(1);
    });
  });

  describe("property injection", () => {
    function setup(uses) {
      const Component = withSearch(
        uses,
        ({ searchTerm, resultSearchTerm, setSearchTerm }) => {
          return (
            <div>
              {searchTerm}
              {resultSearchTerm}
              {setSearchTerm && setSearchTerm.name}
            </div>
          );
        }
      );

      return mount(
        <SearchContext.Provider value={{ driver: mockDriver }}>
          <Component />
        </SearchContext.Provider>
      );
    }

    it("will inject specified state", () => {
      const element = setup(["searchTerm"]);

      expect(element.text()).toEqual("a search term");
    });

    it("will inject a specified action", () => {
      const element = setup(["setSearchTerm"]);

      expect(element.text()).toEqual("setSearchTerm");
    });

    it("will not inject an  unspecified state", () => {
      const element = setup(["resultSearchTerm"]);

      expect(element.text()).toEqual("another search term");
    });

    it("will inject everything if an empty array is passed", () => {
      const element = setup([]);

      expect(element.text()).toEqual(
        "a search termanother search termsetSearchTerm"
      );
    });

    it("will inject everything if undefined is passed", () => {
      const element = setup();

      expect(element.text()).toEqual(
        "a search termanother search termsetSearchTerm"
      );
    });
  });
});
