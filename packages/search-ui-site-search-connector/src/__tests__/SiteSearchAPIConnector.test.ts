import SiteSearchAPIConnector from "..";

import exampleAPIResponse from "./example-response.json";

function fetchResponse(response) {
  return Promise.resolve({
    status: 200,
    json: () => Promise.resolve(response)
  });
}

beforeEach(() => {
  global.Headers = jest.fn();
  global.fetch = jest.fn().mockReturnValue(fetchResponse(exampleAPIResponse));
});

const engineKey = "12345";
const documentType = "national-parks";
const params = {
  documentType,
  engineKey
};

it("can be initialized", () => {
  const connector = new SiteSearchAPIConnector(params);
  expect(connector).toBeInstanceOf(SiteSearchAPIConnector);
});

describe("#onSearch", () => {
  function subject({ beforeSearchCall = undefined, state, queryConfig = {} }) {
    const connector = new SiteSearchAPIConnector({
      ...params,
      beforeSearchCall
    });
    return connector.onSearch(state, queryConfig);
  }

  it("will correctly format an API response", async () => {
    const response = await subject({ state: {}, queryConfig: {} });
    expect(response).toMatchSnapshot();
  });

  it("will pass request state through to search endpoint", async () => {
    const state = {
      searchTerm: "searchTerm",
      current: 1,
      resultsPerPage: 10,
      sortDirection: "desc",
      sortField: "name",
      filters: [
        {
          field: "title",
          type: "all",
          values: ["Acadia", "Grand Canyon"]
        },
        {
          field: "world_heritage_site",
          values: ["true"],
          type: "all"
        }
      ]
    };

    await subject({ state });
    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(
      JSON.parse((global.fetch as jest.Mock).mock.calls[0][1].body)
    ).toEqual({
      engine_key: engineKey,
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
      q: "searchTerm"
    });
  });

  it("will pass queryConfig to search endpoint", async () => {
    const state = {
      searchTerm: "searchTerm"
    };

    const queryConfig = {
      facets: {
        states: {
          type: "value",
          size: 30
        }
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

    await subject({ state, queryConfig });
    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(
      JSON.parse((global.fetch as jest.Mock).mock.calls[0][1].body)
    ).toEqual({
      engine_key: engineKey,
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

  it("will pass request parameter state provided to queryConfig, overriding the same value provided in state", async () => {
    const state = {
      searchTerm: "searchTerm",
      current: 1,
      resultsPerPage: 10,
      sortDirection: "desc",
      sortField: "name",
      filters: [
        {
          field: "title",
          type: "all",
          values: ["Acadia", "Grand Canyon"]
        },
        {
          field: "world_heritage_site",
          values: ["true"],
          type: "all"
        }
      ]
    };

    const queryConfig = {
      current: 2,
      resultsPerPage: 5,
      sortDirection: "asc",
      sortField: "title",
      filters: [
        {
          field: "date_made",
          values: ["yesterday"],
          type: "all"
        }
      ]
    };

    await subject({ state, queryConfig });
    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(
      JSON.parse((global.fetch as jest.Mock).mock.calls[0][1].body)
    ).toEqual({
      engine_key: engineKey,
      page: 2,
      per_page: 5,
      filters: {
        [documentType]: {
          date_made: {
            type: "and",
            values: ["yesterday"]
          }
        }
      },
      sort_direction: {
        "national-parks": "asc"
      },
      sort_field: {
        "national-parks": "title"
      },
      q: "searchTerm"
    });
  });

  it("will use the beforeSearchCall parameter to to amend option parameters to the search endpoint call", async () => {
    const searchTerm = "searchTerm";

    const queryConfig = {
      sortDirection: "desc",
      sortField: "name",
      resultsPerPage: 5
    };

    const beforeSearchCall = (options, next) => {
      // Remove sort_direction and sort_field
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { sort_direction, sort_field, ...rest } = options;
      return next({
        ...rest,
        // Add group
        group: { field: "title" }
      });
    };

    await subject({
      beforeSearchCall,
      state: { searchTerm },
      queryConfig
    });

    expect(
      JSON.parse((global.fetch as jest.Mock).mock.calls[0][1].body)
    ).toEqual({
      per_page: 5,
      engine_key: engineKey,
      q: "searchTerm",
      group: { field: "title" }
    });
  });
});

describe("#onAutocomplete", () => {
  function subject({
    beforeAutocompleteResultsCall = undefined,
    state,
    queryConfig = {
      results: {}
    }
  }) {
    const connector = new SiteSearchAPIConnector({
      beforeAutocompleteResultsCall,
      ...params
    });
    return connector.onAutocomplete(state, queryConfig);
  }

  it("will correctly format an API response", async () => {
    const response = await subject({
      state: {},
      queryConfig: {
        results: {}
      }
    });
    expect(response).toMatchSnapshot();
  });

  it("will pass searchTerm from state through to search endpoint", async () => {
    const state = {
      searchTerm: "searchTerm"
    };

    await subject({ state });
    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(
      JSON.parse((global.fetch as jest.Mock).mock.calls[0][1].body)
    ).toEqual({
      engine_key: engineKey,
      q: "searchTerm"
    });
  });

  it("will pass queryConfig to search endpoint", async () => {
    const state = {
      searchTerm: "searchTerm"
    };

    const queryConfig = {
      results: {
        result_fields: {
          title: { raw: {}, snippet: { size: 20, fallback: true } }
        },
        search_fields: {
          title: {},
          description: {},
          states: {}
        }
      }
    };

    await subject({ state, queryConfig });
    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(
      JSON.parse((global.fetch as jest.Mock).mock.calls[0][1].body)
    ).toEqual({
      engine_key: engineKey,
      q: "searchTerm",
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
      }
    });
  });

  it("will pass request parameter state provided to queryConfig", async () => {
    const state = {
      searchTerm: "searchTerm"
    };

    const queryConfig = {
      results: {
        current: 2,
        resultsPerPage: 5,
        filters: [
          {
            field: "world_heritage_site",
            values: ["true"],
            type: "all"
          }
        ],
        sortDirection: "desc",
        sortField: "name"
      }
    };

    await subject({ state, queryConfig });
    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(
      JSON.parse((global.fetch as jest.Mock).mock.calls[0][1].body)
    ).toEqual({
      engine_key: engineKey,
      q: "searchTerm",
      page: 2,
      per_page: 5,
      filters: {
        [documentType]: {
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
      }
    });
  });

  it("will use the beforeAutocompleteResultsCall parameter to amend option parameters to the search endpoint call", async () => {
    const state = {
      searchTerm: "searchTerm"
    };

    const queryConfig = {
      results: {
        sortDirection: "desc",
        sortField: "name",
        resultsPerPage: 5
      }
    };

    const beforeAutocompleteResultsCall = (options, next) => {
      // Remove sort_direction and sort_field
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { sort_direction, sort_field, ...rest } = options;
      return next({
        ...rest,
        // Add group
        group: { field: "title" }
      });
    };

    await subject({ beforeAutocompleteResultsCall, state, queryConfig });
    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(
      JSON.parse((global.fetch as jest.Mock).mock.calls[0][1].body)
    ).toEqual({
      engine_key: engineKey,
      q: "searchTerm",
      per_page: 5,
      group: { field: "title" }
    });
  });
});

describe("#onResultClick", () => {
  function subject(clickData) {
    const connector = new SiteSearchAPIConnector(params);
    return connector.onResultClick(clickData);
  }

  it("will call the API with the correct body params", async () => {
    const query = "test";
    const documentId = "12345";

    await subject({
      query,
      documentId
    });

    expect(global.fetch).toHaveBeenCalledTimes(1);
    const url = (global.fetch as jest.Mock).mock.calls[0][0];
    const urlWithoutTimestamp = url.replace(/&t=\d*/, "").replace(/t=\d*&/, "");
    expect(urlWithoutTimestamp).toEqual(
      `https://search-api.swiftype.com/api/v1/public/analytics/pc?engine_key=${engineKey}&q=${query}&doc_id=${documentId}`
    );
  });
});

describe("#onAutocompleteResultClick", () => {
  function subject(clickData) {
    const connector = new SiteSearchAPIConnector(params);
    return connector.onAutocompleteResultClick(clickData);
  }

  it("will call the API with the correct body params", async () => {
    const query = "test";
    const documentId = "12345";

    await subject({
      query,
      documentId
    });

    expect(global.fetch).toHaveBeenCalledTimes(1);
    const url = (global.fetch as jest.Mock).mock.calls[0][0];
    const urlWithoutTimestamp = url.replace(/&t=\d*/, "").replace(/t=\d*&/, "");
    expect(urlWithoutTimestamp).toEqual(
      `https://search-api.swiftype.com/api/v1/public/analytics/pas?engine_key=${engineKey}&q=${query}&doc_id=${documentId}`
    );
  });
});
