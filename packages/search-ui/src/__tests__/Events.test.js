import Events from "../Events";
import { getMockApiConnector } from "../test/helpers";

function mockPromise(value) {
  return jest.fn().mockReturnValue(Promise.resolve(value));
}

function setupMockConnector({ apiConnectorConfig = {} } = {}) {
  const apiConnector = getMockApiConnector();
  if (apiConnectorConfig.onSearch) {
    apiConnector.onSearch = apiConnectorConfig.onSearch;
  }
  if (apiConnectorConfig.onResultClick) {
    apiConnector.onResultClick = apiConnectorConfig.onResultClick;
  }
  if (apiConnectorConfig.onAutocompleteResultClick) {
    apiConnector.onAutocompleteResultClick =
      apiConnectorConfig.onAutocompleteResultClick;
  }
  if (apiConnectorConfig.onAutocomplete) {
    apiConnector.onAutocomplete = apiConnectorConfig.onAutocomplete;
  }

  return apiConnector;
}

const eventsToHandlers = {
  search: "onSearch",
  autocomplete: "onAutocomplete",
  resultClick: "onResultClick",
  autocompleteResultClick: "onAutocompleteResultClick"
};

it("can be instantiated", () => {
  const events = new Events();
  expect(events instanceof Events).toBe(true);
});

describe("when an API connector is provided", () => {
  Object.entries(eventsToHandlers).forEach(([eventName, handlerName]) => {
    describe(`and '${eventName}' is called`, () => {
      it(`will use the connector's '${handlerName}' handler`, async () => {
        const response = {};
        const apiConnector = setupMockConnector({
          apiConnectorConfig: {
            [handlerName]: mockPromise(response)
          }
        });
        const events = new Events({ apiConnector });

        expect(await events[eventName]()).toBe(response);
      });
    });
  });
});

describe("when a handler is provided", () => {
  Object.entries(eventsToHandlers).forEach(([eventName, handlerName]) => {
    describe(`and '${eventName}' is called`, () => {
      it(`will use the provided '${handlerName}' handler`, async () => {
        const response = {};
        const events = new Events({ [handlerName]: mockPromise(response) });

        expect(await events[eventName]()).toBe(response);
      });
    });
  });
});

describe("when nothing provided", () => {
  Object.entries(eventsToHandlers).forEach(([eventName, handlerName]) => {
    describe(`and '${eventName}' is called`, () => {
      it(`will use the provided '${handlerName}' handler`, async () => {
        const events = new Events({});

        expect(() => events[eventName]()).toThrow();
      });
    });
  });
});

describe("when an API connector and handler are both provided", () => {
  Object.entries(eventsToHandlers).forEach(([eventName, handlerName]) => {
    describe(`and '${eventName}' is called`, () => {
      it(`will use the provided '${handlerName}' handler`, async () => {
        const connectorResponse = {};
        const handlerResponse = {};
        const apiConnector = setupMockConnector({
          apiConnectorConfig: {
            [handlerName]: mockPromise(connectorResponse)
          }
        });
        const events = new Events({
          apiConnector,
          [handlerName]: mockPromise(handlerResponse)
        });

        expect(await events[eventName]()).toBe(handlerResponse);
      });

      it(`will append a 'next' parameter to '${handlerName}', which calls through to connector`, async () => {
        const connectorResponse = {};
        const apiConnector = setupMockConnector({
          apiConnectorConfig: {
            [handlerName]: mockPromise(connectorResponse)
          }
        });
        const events = new Events({
          apiConnector,
          [handlerName]: (bogus1, bogus2, next) => {
            return next(bogus1, bogus2);
          }
        });

        const response = await events[eventName]("bogus1", "bogus2");
        expect(response).toBe(connectorResponse);
      });
    });
  });
});
