import { RequestState } from "../types";
import URLManager from "../URLManager";

function createManager() {
  const manager = new URLManager();
  return manager;
}

const basicParameterState: RequestState = {
  filters: [
    {
      field: "test",
      values: ["value"],
      type: "all"
    },
    {
      field: "node",
      values: ["value"],
      type: "all"
    }
  ],
  resultsPerPage: 20,
  searchTerm: "node",
  sortDirection: "asc",
  sortField: "name"
};

const basicParameterStateAsUrl =
  "?filters%5B0%5D%5Bfield%5D=test&filters%5B0%5D%5Bvalues%5D%5B0%5D=value&filters%5B0%5D%5Btype%5D=all&filters%5B1%5D%5Bfield%5D=node&filters%5B1%5D%5Bvalues%5D%5B0%5D=value&filters%5B1%5D%5Btype%5D=all&resultsPerPage=n_20_n&q=node&size=20&sort-direction=asc&sort-field=name";

const parameterStateWithSortList: RequestState = {
  resultsPerPage: 20,
  sortList: [
    { direction: "asc", field: "name" },
    { direction: "desc", field: "title" }
  ]
};

const parameterStateWithSortListAsUrl =
  "?size=n_20_n&sort%5B0%5D%5Bfield%5D=name&sort%5B0%5D%5Bdirection%5D=asc&sort%5B1%5D%5Bfield%5D=title&sort%5B1%5D%5Bdirection%5D=desc";

const parameterStateWithRangeFilters: RequestState = {
  filters: [
    {
      field: "test",
      values: [
        {
          from: 12,
          name: "test",
          to: 4000
        }
      ],
      type: "all"
    }
  ]
};

it("can be initialized", () => {
  const manager = new URLManager();
  expect(manager).toBeInstanceOf(URLManager);
});

describe("#getStateFromURL", () => {
  it("will parse the current state from the URL", () => {
    const manager = createManager();
    manager.history.location.search =
      "?filters%5B0%5D%5Bdependencies%5D%5B0%5D=underscore&filters%5B1%5D%5Bkeywords%5D%5B0%5D=node&q=node&size=20&sort-direction=asc&sort-field=name";

    const state = manager.getStateFromURL();
    expect(state).toMatchSnapshot();
  });

  it("will parse range filter types", () => {
    const manager = createManager();
    manager.history.location.search =
      "?filters[0][date][0][from]=n_12_n&filters[0][date][0][to]=n_4000_n&filters[0][date][1][to]=n_4000_n&filters[1][cost][0][from]=n_50_n&filters[2][keywords][0]=node";

    const state = manager.getStateFromURL();
    expect(state).toMatchSnapshot();
  });

  it("will parse sortList items", () => {
    const manager = createManager();
    manager.history.location.search =
      "?sort%5B0%5D%5Bstates%5D=asc&sort%5B1%5D%5Btitle%5D=asc";

    const state = manager.getStateFromURL();
    expect(state).toMatchSnapshot();
  });

  it("will ignore unrecognized parameters", () => {
    const manager = createManager();
    manager.history.location.search =
      "?q=test&bogus=12&tommy=dunn&whatever&ok&thatsall";

    const state = manager.getStateFromURL();
    expect(state).toMatchSnapshot();
  });

  it("will correctly handle multiple instances of the same parameter", () => {
    const manager = createManager();
    manager.history.location.search =
      "filters[0][dependencies][0]=underscore&filters[0][dependencies][1]=another&filters[1][keywords][0]=node&q=bad&q=node&size=bad&size=20&sort-direction=bad&sort-direction=asc&sort-field=bad&sort-field=name";

    const state = manager.getStateFromURL();
    expect(state).toMatchSnapshot();
  });
});

describe("#pushStateToURL", () => {
  it("will update the url with the url corresponding to the provided state", () => {
    const manager = createManager();
    const spy = jest.spyOn(manager.history, "push");
    manager.pushStateToURL(basicParameterState);
    const queryString = spy.mock.calls[0][0].search;
    expect(queryString).toEqual(
      "?q=node&size=n_20_n&filters%5B0%5D%5Bfield%5D=test&filters%5B0%5D%5Bvalues%5D%5B0%5D=value&filters%5B0%5D%5Btype%5D=all&filters%5B1%5D%5Bfield%5D=node&filters%5B1%5D%5Bvalues%5D%5B0%5D=value&filters%5B1%5D%5Btype%5D=all&sort-field=name&sort-direction=asc"
    );
  });

  describe("filters", () => {
    it("will update the url with range filter types", () => {
      const manager = createManager();
      const spy = jest.spyOn(manager.history, "push");
      manager.pushStateToURL(parameterStateWithRangeFilters);
      const queryString = spy.mock.calls[0][0].search;
      expect(queryString).toEqual(
        "?filters%5B0%5D%5Bfield%5D=test&filters%5B0%5D%5Bvalues%5D%5B0%5D%5Bfrom%5D=n_12_n&filters%5B0%5D%5Bvalues%5D%5B0%5D%5Bname%5D=test&filters%5B0%5D%5Bvalues%5D%5B0%5D%5Bto%5D=n_4000_n&filters%5B0%5D%5Btype%5D=all"
      );
    });
  });

  describe("sortList", () => {
    it("will update the url with sortList items", () => {
      const manager = createManager();
      const spy = jest.spyOn(manager.history, "push");
      manager.pushStateToURL(parameterStateWithSortList);
      const queryString = spy.mock.calls[0][0].search;
      expect(queryString).toEqual(
        "?size=n_20_n&sort%5B0%5D%5Bdirection%5D=asc&sort%5B0%5D%5Bfield%5D=name&sort%5B1%5D%5Bdirection%5D=desc&sort%5B1%5D%5Bfield%5D=title"
      );
    });
  });

  describe("replaceUrl", () => {
    it("will update the url using 'replace' instead of 'push", () => {
      const manager = createManager();
      const spy = jest.spyOn(manager.history, "replace");
      manager.pushStateToURL(basicParameterState, { replaceUrl: true });
      const queryString = spy.mock.calls[0][0].search;
      expect(queryString).toEqual(
        "?q=node&size=n_20_n&filters%5B0%5D%5Bfield%5D=test&filters%5B0%5D%5Bvalues%5D%5B0%5D=value&filters%5B0%5D%5Btype%5D=all&filters%5B1%5D%5Bfield%5D=node&filters%5B1%5D%5Bvalues%5D%5B0%5D=value&filters%5B1%5D%5Btype%5D=all&sort-field=name&sort-direction=asc"
      );
    });
  });
});

describe("#onURLStateChange", () => {
  let manager: URLManager;
  let listenSpy;
  let pushSpy;

  function setup() {
    manager = createManager();
    listenSpy = jest.spyOn(manager.history, "listen");
    pushSpy = jest.spyOn(manager.history, "push");
  }

  function pushStateToURL(state) {
    manager.pushStateToURL(state);

    return pushSpy.mock.calls[0][0].search;
  }

  function simulateBrowserHistoryEvent(newUrl) {
    // Since we're not in a real browser, we simulate the change event that
    // would have ocurred.
    listenSpy.mock.calls[0][0]({
      search: newUrl
    });
  }

  function subject(onURLStateChangeHandler, newUrl) {
    // Set our handler, which we be called any time url state changes
    manager.onURLStateChange(onURLStateChangeHandler);

    simulateBrowserHistoryEvent(newUrl);
  }

  it("will call provided callback with updated state when url changes", () => {
    setup();
    const mock = jest.fn();

    // Provide url state change handler
    subject(mock, basicParameterStateAsUrl);

    // Verify it is called when url state changes
    expect(mock).toHaveBeenCalledWith(basicParameterState);
  });

  it("will call provided callback with updated state when url changes with sortList", () => {
    setup();
    let newState;

    // Provide url state change handler
    subject((state) => {
      newState = state;
    }, parameterStateWithSortListAsUrl);

    // Verify it is called when url state changes
    expect(newState).toEqual(parameterStateWithSortList);
  });

  /*
    If we triggered the callback every time we pushed state to the url,
    we would have an infinite loop.

    pushStateToURL -> UpdateUrl -> HistoryEvent -> Handler -> pushstateToURL

    Instead, we just want:
    pushStateToURL -> UpdateUrl -> HistoryEvent -> Handler

  */
  it("will not trigger callback as a result of pushStateToURL", () => {
    setup();

    // Push state to the url
    // newUrl is the url that the browser changed to
    const newUrl = pushStateToURL(basicParameterState);
    let newState;

    // Provide url state change handler
    subject((state) => {
      newState = state;
    }, newUrl);

    // Verify it is called when url state changes
    expect(newState).toBe(undefined);
  });

  it("will trigger callback if navigating back to a url with browser buttons", () => {
    setup();

    // Push state to the url
    // newUrl is the url that the browser changed to
    const newUrl = pushStateToURL(basicParameterState);
    let newState;

    // Provide url state change handler
    subject((state) => {
      newState = state;
    }, newUrl);

    // Verify it is called when url state changes
    expect(newState).toBe(undefined);

    // Back button to empty state
    simulateBrowserHistoryEvent("");
    expect(newState).toEqual({}); // Was called, but empty state

    // Forward button to double back to the original "newUrl"
    simulateBrowserHistoryEvent(newUrl);
    expect(newState).toEqual(basicParameterState);
  });
});
