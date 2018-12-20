import SiteSearchAPIConnector from "..";

import exampleAPIResponse from "../../resources/example-response.json";

function fetchResponse(response) {
  return Promise.resolve({
    json: () => Promise.resolve(response)
  });
}

beforeEach(() => {
  global.Headers = jest.fn();
  global.fetch = jest.fn().mockReturnValue(fetchResponse(exampleAPIResponse));
});

const engineKey = 12345;
const documentType = "national-parks";
const params = {
  documentType,
  engineKey
};

it("can be initialized", () => {
  const connector = new SiteSearchAPIConnector(params);
  expect(connector).toBeInstanceOf(SiteSearchAPIConnector);
});

describe("#search", () => {
  function subject({
    additionalOptions,
    searchTerm = "searchTerm",
    options = {}
  }) {
    const connector = new SiteSearchAPIConnector({
      ...params,
      additionalOptions
    });
    return connector.search(searchTerm, options);
  }

  it("will call the API with the correct body params", async () => {
    const searchTerm = "searchTerm";
    const options = {
      arbitraryParameter: "shouldRemain",
      page: {
        current: 1,
        size: 10
      },
      sort: {
        name: "desc"
      },
      facets: {
        states: {
          type: "value",
          size: 30
        }
      },
      filters: {
        all: [
          {
            title: "Acadia"
          },
          {
            title: "Grand Canyon"
          },
          {
            world_heritage_site: "true"
          }
        ]
      },
      result_fields: {
        title: { raw: {}, snippet: { size: 20, fallback: true } }
      },
      search_fields: {
        title: {},
        description: {},
        states: {}
      }
    };
    await subject({ searchTerm, options });
    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(JSON.parse(global.fetch.mock.calls[0][1].body)).toEqual({
      engine_key: engineKey,
      arbitraryParameter: "shouldRemain",
      page: 1,
      per_page: 10,
      filters: {
        [documentType]: {
          title: {
            type: "and",
            values: ["Acadia", "Grand Canyon"]
          },
          world_heritage_site: {
            type: "and",
            values: ["true"]
          }
        }
      },
      sort_direction: {
        "national-parks": "desc"
      },
      sort_field: {
        "national-parks": "name"
      },
      facets: {
        "national-parks": ["states"]
      },
      fetch_fields: {
        [documentType]: ["title"]
      },
      search_fields: {
        [documentType]: ["title", "description", "states"]
      },
      highlight_fields: {
        [documentType]: {
          title: { size: 20, fallback: true }
        }
      },
      q: "searchTerm"
    });
  });

  it("will only add body parameters if the corresponding configuration has been provided", async () => {
    await subject({});
    expect(JSON.parse(global.fetch.mock.calls[0][1].body)).toEqual({
      engine_key: engineKey,
      q: "searchTerm"
    });
  });

  it("will correctly format an API response", async () => {
    const response = await subject({});
    expect(response).toMatchSnapshot();
  });

  it("will use the additionalOptions parameter to append additional parameters to the search endpoint call", async () => {
    const options = {};
    const groupFields = {
      group: { field: "title" }
    };
    const additionalOptions = () => groupFields;
    const searchTerm = "searchTerm";
    await subject({ additionalOptions, searchTerm, options });
    expect(JSON.parse(global.fetch.mock.calls[0][1].body)).toEqual({
      engine_key: engineKey,
      q: "searchTerm",
      ...groupFields
    });
  });
});

describe("#click", () => {
  function subject(clickData) {
    const connector = new SiteSearchAPIConnector(params);
    return connector.click(clickData);
  }

  it("will call the API with the correct body params", async () => {
    const query = "test";
    const documentId = "12345";

    await subject({
      query,
      documentId
    });

    expect(global.fetch).toHaveBeenCalledTimes(1);
    const url = global.fetch.mock.calls[0][0];
    const urlWithoutTimestamp = url.replace(/&t=\d*/, "").replace(/t=\d*&/, "");
    expect(urlWithoutTimestamp).toEqual(
      `https://search-api.swiftype.com/api/v1/public/analytics/pc?engine_key=${engineKey}&q=${query}&doc_id=${documentId}`
    );
  });
});
