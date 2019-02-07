export const searchResponse = {
  info: {
    facets: {},
    meta: {
      page: {
        total_pages: 100,
        total_results: 1000
      },
      request_id: "12345"
    }
  },
  results: [{}, {}]
};

export const searchResponseWithoutFacets = {
  info: {
    meta: {
      page: {
        total_pages: 100,
        total_results: 1000
      },
      request_id: "12345"
    }
  },
  results: [{}, {}]
};
