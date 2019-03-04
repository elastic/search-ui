function adaptation1AdaptFacetValue(facetValue) {
  const { count, value, ...rest } = facetValue;
  return {
    count,
    value: value
      ? value
      : {
          ...rest
        }
  };
}

function adaptation2AddLabelToFacet(fieldName, facet) {
  return {
    field: fieldName,
    ...facet
  };
}

export function adaptFacets(facets) {
  if (!facets || Object.keys(facets).length === 0) return facets;

  return Object.entries(facets).reduce((acc, [fieldName, facet]) => {
    const adaptedFacet = facet.map(v => {
      const { type, data, ...rest } = v;
      return adaptation2AddLabelToFacet(fieldName, {
        type,
        data: data.map(adaptation1AdaptFacetValue),
        ...rest
      });
    });

    return {
      ...acc,
      [fieldName]: adaptedFacet
    };
  }, {});
}
