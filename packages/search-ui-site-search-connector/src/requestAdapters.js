export function adaptFacetConfig(facets) {
  if (!facets) return;

  const convertInvalidFacetsToUndefined = ([fieldName, config]) => {
    if (config.type != "value") {
      console.warn(
        `Dropping ${fieldName} facet, only value facets are supported in Site Search`
      );
      return;
    }
    return [fieldName, config];
  };

  const getKey = ([key]) => key;

  const config = Object.entries(facets)
    .map(convertInvalidFacetsToUndefined)
    .filter(v => v)
    .map(getKey);

  if (!config.length) return;
  return config;
}

export function adaptFilterConfig(filterConfig) {
  if (!filterConfig) return;

  return filterConfig.all.reduce((acc, filter) => {
    const [fieldName, fieldValue] = Object.entries(filter)[0];

    if (!acc[fieldName]) {
      acc[fieldName] = {
        type: "all",
        values: []
      };
    }

    acc[fieldName].values.push(fieldValue);

    return acc;
  }, {});
}

export function adaptResultFieldsConfig(resultFieldsConfig) {
  if (!resultFieldsConfig) return [];

  const fetchFields = Object.keys(resultFieldsConfig);

  const highlightFields = Object.entries(resultFieldsConfig).reduce(
    (acc, [fieldName, fieldConfig]) => {
      if (!fieldConfig.snippet) return acc;
      return {
        ...acc,
        [fieldName]: fieldConfig.snippet
      };
    },
    {}
  );

  return [fetchFields, highlightFields];
}

export function adaptSearchFieldsConfig(searchFieldsConfig) {
  if (!searchFieldsConfig) return [];

  return Object.keys(searchFieldsConfig);
}
