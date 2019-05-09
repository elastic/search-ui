function calculateFrom(current, resultsPerPage) {
  return (current - 1) * resultsPerPage;
}

function calculateSort(sortDirection, sortField) {
  if (sortDirection && sortField) {
    return [{ [`${sortField}.keyword`]: sortDirection }];
  }
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

  const query = searchTerm
    ? {
        multi_match: {
          query: searchTerm,
          fields: ["title", "description"]
        }
      }
    : { match_all: {} };

  const body = {
    query,
    highlight: {
      fragment_size: 200,
      number_of_fragments: 1,
      fields: {
        title: {}
      }
    },
    ...(sort && { sort }),
    ...(resultsPerPage && { size: resultsPerPage }),
    ...(resultsPerPage &&
      current && { from: calculateFrom(current, resultsPerPage) })
  };

  return body;
}
