function calculateFrom(current, resultsPerPage) {
  if (!current || !resultsPerPage) return;
  return (current - 1) * resultsPerPage;
}

function calculateSort(sortDirection, sortField) {
  if (sortDirection && sortField) {
    return [{ [`${sortField}.keyword`]: sortDirection }];
  }
}

function calculateQuery(searchTerm) {
  return searchTerm
    ? {
        multi_match: {
          query: searchTerm,
          fields: ["title", "description"]
        }
      }
    : { match_all: {} };
}

export default function buildRequest(state) {
  // TODO request - filters

  const {
    current,
    resultsPerPage,
    searchTerm,
    sortDirection,
    sortField
  } = state;

  const sort = calculateSort(sortDirection, sortField);
  const query = calculateQuery(searchTerm);
  const size = resultsPerPage;
  const from = calculateFrom(current, resultsPerPage);

  const body = {
    // Static query Configuration
    // --------------------------
    // https://www.elastic.co/guide/en/elasticsearch/reference/7.x/search-request-highlighting.html
    highlight: {
      fragment_size: 200,
      number_of_fragments: 1,
      fields: {
        title: {},
        description: {}
      }
    },
    //https://www.elastic.co/guide/en/elasticsearch/reference/7.x/search-request-source-filtering.html#search-request-source-filtering
    _source: ["id", "nps_link", "title", "description"],
    aggs: {
      states: { terms: { field: "states.keyword", size: 30 } },
      world_heritage_site: {
        terms: { field: "world_heritage_site" }
      },
      visitors: {
        range: {
          field: "visitors",
          ranges: [
            { from: 0.0, to: 10000.0, key: "0 - 10000" },
            { from: 10001.0, to: 100000.0, key: "10001 - 100000" },
            { from: 100001.0, to: 500000.0, key: "100001 - 500000" },
            { from: 500001.0, to: 1000000.0, key: "500001 - 1000000" },
            { from: 1000001.0, to: 5000000.0, key: "1000001 - 5000000" },
            { from: 5000001.0, to: 10000000.0, key: "5000001 - 10000000" },
            { from: 10000001.0, key: "10000001+" }
          ]
        }
      },
      acres: {
        range: {
          field: "acres",
          ranges: [
            { from: -1.0, key: "Any" },
            { from: 0.0, to: 1000.0, key: "Small" },
            { from: 1001.0, to: 100000.0, key: "Medium" },
            { from: 100001.0, key: "Large" }
          ]
        }
      }
    },

    // Dynamic values based on current Search UI state
    // --------------------------
    // https://www.elastic.co/guide/en/elasticsearch/reference/7.x/full-text-queries.html
    query,
    // https://www.elastic.co/guide/en/elasticsearch/reference/7.x/search-request-sort.html
    ...(sort && { sort }),
    // https://www.elastic.co/guide/en/elasticsearch/reference/7.x/search-request-from-size.html
    ...(size && { size }),
    ...(from && { from })
  };

  return body;
}