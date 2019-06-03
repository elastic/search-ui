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

    it("should allow a new value to be injecting into a component", () => {
      const element = setup(
        c => c,
        ({ searchTerm }) => {
          return {
            searchTerm: searchTerm + " New Term"
          };
        }
      );
      expect(element.text()).toEqual("a search term New Term");
    });

    it("should not have access to values that not specified in the 'mapContextToProps' parameter", () => {
      const element = setup(
        ({ resultSearchTerm }) => ({ resultSearchTerm }),
        ({ searchTerm }) => {
          return {
            searchTerm: searchTerm + " New Term"
          };
        }
      );
      expect(element.text()).toEqual("undefined New Term");
    });

    it("should allow a brand new values to be injected", () => {
      const element = setup(
        c => c,
        () => {
          return {
            clap: "your hands"
          };
        }
      );
      expect(element.text()).toEqual("your hands");
    });
  });

  describe("driver subscription", () => {
    function setup(mapContextToProps) {
      const Component = withSearch(mapContextToProps)(
        ({ searchTerm, setSearchTerm }) => {
          return (
            <div>
              {searchTerm}, {setSearchTerm.name}
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

    it("will subscribe to state updates", () => {
      const element = setup(c => c);
      mockDriver.getActions().setSearchTerm("New Term");
      expect(element.text()).toEqual("New Term, setSearchTerm");
    });

    it("will maintain action properties on state updates when mapContextToProps parameter is passed", () => {
      const element = setup(({ searchTerm, setSearchTerm }) => ({
        searchTerm,
        setSearchTerm
      }));
      mockDriver.getActions().setSearchTerm("New Term");
      expect(element.text()).toEqual("New Term, setSearchTerm");
    });

    it("will unsubsribe on unmount", () => {
      const element = setup(c => c);
      element.unmount();
      expect(mockDriver.unsubscribeToStateChanges.mock.calls.length).toEqual(1);
    });
  });

  describe("property injection", () => {
    function setup(mapContextToProps) {
      const Component = withSearch(mapContextToProps)(
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
      const element = setup(({ searchTerm }) => ({ searchTerm }));

      expect(element.text()).toEqual("a search term");
    });

    it("will inject a specified action", () => {
      const element = setup(({ setSearchTerm }) => ({ setSearchTerm }));

      expect(element.text()).toEqual("setSearchTerm");
    });

    it("will not inject an  unspecified state", () => {
      const element = setup(({ resultSearchTerm }) => ({ resultSearchTerm }));

      expect(element.text()).toEqual("another search term");
    });

    it("will error if nothing is passed", () => {
      expect(() => setup()).toThrow();
    });

    it("will inject nothing if the function injects nothing", () => {
      const element = setup(() => {});

      expect(element.text()).toEqual("");
    });
  });
});
