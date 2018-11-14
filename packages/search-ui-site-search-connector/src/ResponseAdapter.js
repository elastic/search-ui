import ResultList from "./ResultList";

export function toResultList(response, documentType) {
  const results = getResults(response.records, documentType);
  const info = getInfo(response.info, documentType);
  return new ResultList(results, info);
}

function getFacets(docInfo) {
  const addEachKeyValueToObject = (acc, [key, value]) => ({
    ...acc,
    [key]: value
  });
  return Object.entries(docInfo.facets)
    .map(([facetName, facetValue]) => {
      return [
        facetName,
        [
          {
            data: Object.entries(facetValue).map(([value, count]) => ({
              value,
              count
            })),
            type: "value"
          }
        ]
      ];
    })
    .reduce(addEachKeyValueToObject, {});
}

function getInfo(info, documentType) {
  const docInfo = info[documentType];
  const facets = getFacets(docInfo);

  return {
    ...(facets && { facets }),
    meta: {
      warnings: [], // TODO
      page: {
        current: docInfo.current_page,
        total_pages: docInfo.num_pages,
        size: docInfo.per_page,
        total_results: docInfo.total_result_count
      },
      request_id: "" // TODO
    }
  };
}

// TODO Handle meta that we're just throwing away right now, like sort and
// "_" prefixed fields
function getResults(records, documentType) {
  const isMetaField = key => key.startsWith("_");
  const toObjectWithRaw = value => ({ raw: value });
  const addEachKeyValueToObject = (acc, [key, value]) => ({
    ...acc,
    [key]: value
  });

  return records[documentType].map(record => {
    const { highlight, sort, ...rest } = record;

    const result = Object.entries(rest)
      .filter(([fieldName]) => !isMetaField(fieldName))
      .map(([fieldName, fieldValue]) => [
        fieldName,
        toObjectWithRaw(fieldValue)
      ])
      .reduce(addEachKeyValueToObject, {});

    Object.entries(highlight).forEach(([key, value]) => {
      result[key].snippet = value;
    });

    return result;
  });
}
