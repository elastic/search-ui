const addEachKeyValueToObject = (acc, [key, value]) => ({
  ...acc,
  [key]: value
});

function totalPages(resultsPerPage, totalResults) {
  if (totalResults === 0) return 1;
  return Math.ceil(totalResults / resultsPerPage);
}

function getInfo(hits, resultsPerPage) {
  const totalResults = hits.total.value;
  return {
    totalPages: resultsPerPage ? totalPages(resultsPerPage, totalResults) : 0, // TODO
    totalResults
  };
}

function getResults(hits) {
  const toObjectWithRaw = value => ({ raw: value });

  return hits.map(record => {
    return Object.entries(record._source)
      .map(([fieldName, fieldValue]) => [
        fieldName,
        toObjectWithRaw(fieldValue)
      ])
      .reduce(addEachKeyValueToObject, {});
  });
}

export default function buildState(response, resultsPerPage) {
  const results = getResults(response.hits.hits);
  const info = getInfo(response.hits, resultsPerPage);
  return {
    results,
    ...info
  };
}
