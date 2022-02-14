const addEachKeyValueToObject = (acc: any, [key, value]) => ({
  ...acc,
  [key]: value
});

export function getFacets(docInfo: any) {
  if (!docInfo.facets) return {};

  return Object.entries(docInfo.facets)
    .map(([facetName, facetValue]) => {
      return [
        facetName,
        [
          {
            field: facetName,
            data: Object.entries(facetValue).map(([value, count]) => ({
              value,
              count
            })),
            // Site Search does not support any other type of facet
            type: "value"
          }
        ]
      ];
    })
    .reduce(addEachKeyValueToObject, {});
}

export function getResults(records: Record<string, any>, documentType: string) {
  const isMetaField = (key: string) => key.startsWith("_");
  const toObjectWithRaw = (value: any) => ({ raw: value });

  return records[documentType].map((record: any) => {
    const { highlight, sort, ...rest } = record; //eslint-disable-line

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
