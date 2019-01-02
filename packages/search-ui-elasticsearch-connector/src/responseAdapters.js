import ResultList from "./ResultList";

export function toResultList(response) {
  const results = getResults(response.hits.hits);
  const info = getInfo(response.hits);
  return new ResultList(results, info);
}

const addEachKeyValueToObject = (acc, [key, value]) => ({
  ...acc,
  [key]: value
});

function getInfo(hits) {
  return {
    meta: {
      warnings: [], // TODO
      page: {
        current: 1, // TODO
        total_pages: 10,
        size: 10,
        total_results: hits.total
      },
      request_id: "" // TODO
    }
  };
}

function getResults(records) {
  const toObjectWithRaw = value => ({ raw: value });

  return records.map(record => {
    return Object.entries(record._source)
      .map(([fieldName, fieldValue]) => [
        fieldName,
        toObjectWithRaw(fieldValue)
      ])
      .reduce(addEachKeyValueToObject, {});
  });
}
