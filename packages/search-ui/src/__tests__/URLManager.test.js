import URLManager from "../URLManager";

function createManager() {
  const manager = new URLManager();
  manager.history = {
    location: {
      search: ""
    },
    listen: jest.fn(),
    push: jest.fn()
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
  "?fv-dependencies=underscore&fv-dependencies=another&fv-keywords=node&q=node&size=20&sort-direction=asc&sort-field=name";

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
      "?fv-dependencies=underscore&fv-keywords=node&q=node&size=20&sort-direction=asc&sort-field=name";

    const state = manager.getStateFromURL();
    expect(state).toMatchSnapshot();
  });

  it("will parse range filter types", () => {
    const manager = createManager();
    manager.history.location.search =
      "?fr-date=12_4000&fr-date=_4000&fr-cost=50_&fv-keywords=node";

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
      "fv-dependencies=underscore&fv-dependencies=another&fv-keywords=node&q=bad&q=node&size=bad&size=20&sort-direction=bad&sort-direction=asc&sort-field=bad&sort-field=name";

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
      "?fv-dependencies=underscore&fv-dependencies=another&fv-keywords=node&q=node&size=20&sort-field=name&sort-direction=asc"
    );
  });

  it("will update the url with range filter types", () => {
    const manager = createManager();
    manager.pushStateToURL(parameterStateWithRangeFilters);
    const queryString = manager.history.push.mock.calls[0][0].search;
    expect(queryString).toEqual(
      "?fr-date=12_4000&fr-date=_4000&fr-cost=50_&fv-keywords=node"
    );
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
