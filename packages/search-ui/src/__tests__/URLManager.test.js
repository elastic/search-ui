import URLManager from "../URLManager";

function createManager() {
  const manager = new URLManager();
  manager.history = {
    location: {
      search: ""
    },
    listen: jest.fn(),
    push: jest.fn(),
    replace: jest.fn()
  };
  return manager;
}

const basicParameterState = {
  filters: [
    {
      dependencies: ["underscore", "another"]
    },
    {
      keywords: ["node"]
    }
  ],
  resultsPerPage: 20,
  searchTerm: "node",
  sortDirection: "asc",
  sortField: "name"
};

const basicParameterStateAsUrl =
  "?filters[0][dependencies][0]=underscore&filters[0][dependencies][1]=another&filters[1][keywords][0]=node&q=node&size=20&sort-direction=asc&sort-field=name";

const parameterStateWithRangeFilters = {
  filters: [
    {
      date: [
        {
          from: 12,
          to: 4000
        },
        {
          to: 4000
        }
      ]
    },
    {
      cost: [
        {
          from: 50
        }
      ]
    },
    {
      keywords: "node"
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
    manager.pushStateToURL(basicParameterState);
    const queryString = manager.history.push.mock.calls[0][0].search;
    expect(queryString).toEqual(
      "?q=node&size=n_20_n&filters%5B0%5D%5Bdependencies%5D%5B0%5D=underscore&filters%5B0%5D%5Bdependencies%5D%5B1%5D=another&filters%5B1%5D%5Bkeywords%5D%5B0%5D=node&sort-field=name&sort-direction=asc"
    );
  });

  describe("filters", () => {
    it("will update the url with range filter types", () => {
      const manager = createManager();
      manager.pushStateToURL(parameterStateWithRangeFilters);
      const queryString = manager.history.push.mock.calls[0][0].search;
      expect(queryString).toEqual(
        "?filters%5B0%5D%5Bdate%5D%5B0%5D%5Bfrom%5D=n_12_n&filters%5B0%5D%5Bdate%5D%5B0%5D%5Bto%5D=n_4000_n&filters%5B0%5D%5Bdate%5D%5B1%5D%5Bto%5D=n_4000_n&filters%5B1%5D%5Bcost%5D%5B0%5D%5Bfrom%5D=n_50_n&filters%5B2%5D%5Bkeywords%5D=node"
      );
    });
  });

  describe("replaceUrl", () => {
    it("will update the url using 'replace' instead of 'push", () => {
      const manager = createManager();
      manager.pushStateToURL(basicParameterState, { replaceUrl: true });
      const queryString = manager.history.replace.mock.calls[0][0].search;
      expect(queryString).toEqual(
        "?q=node&size=n_20_n&filters%5B0%5D%5Bdependencies%5D%5B0%5D=underscore&filters%5B0%5D%5Bdependencies%5D%5B1%5D=another&filters%5B1%5D%5Bkeywords%5D%5B0%5D=node&sort-field=name&sort-direction=asc"
      );
    });
  });
});

describe("#onURLStateChange", () => {
  let manager;

  function setup() {
    manager = createManager();
  }

  function pushStateToURL(state) {
    manager.pushStateToURL(state);
    return manager.history.push.mock.calls[0][0].search;
  }

  function simulateBrowserHistoryEvent(newUrl) {
    // Since we're not in a real browser, we simulate the change event that
    // would have ocurred.
    manager.history.listen.mock.calls[0][0]({
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
    let newState;

    // Provide url state change handler
    subject(state => {
      newState = state;
    }, basicParameterStateAsUrl);

    // Verify it is called when url state changes
    expect(newState).toEqual(basicParameterState);
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
    subject(state => {
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
    subject(state => {
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
