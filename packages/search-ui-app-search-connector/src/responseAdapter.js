function adaptation1AdaptFacetValue(
  facetValue,
  additionalFacetValueFieldsForField = {}
) {
  const { count, value, ...rest } = facetValue;
  return {
    count,
    value: value
      ? value
      : {
          ...rest,
          ...additionalFacetValueFieldsForField
        }
  };
}

function adaptation2AddLabelToFacet(fieldName, facet) {
  return {
    field: fieldName,
    ...facet
  };
}

function adaptFacets(facets, { additionalFacetValueFields = {} }) {
  if (!facets || Object.keys(facets).length === 0) return facets;

  return Object.entries(facets).reduce((acc, [fieldName, facet]) => {
    const adaptedFacet = facet.map(v => {
      const { type, data, ...rest } = v;
      return adaptation2AddLabelToFacet(fieldName, {
        type,
        data: data.map(f =>
          adaptation1AdaptFacetValue(f, additionalFacetValueFields[fieldName])
        ),
        ...rest
      });
    });

    return {
      ...acc,
      [fieldName]: adaptedFacet
    };
  }, {});
}

export function adaptResponse(response, options = {}) {
  const facets = response.info.facets;
  const requestId = response.info.meta.request_id;

  const totalPages = response.info.meta.page
    ? response.info.meta.page.total_pages
    : undefined;

  const totalResults = response.info.meta.page
    ? response.info.meta.page.total_results
    : undefined;

  return {
    ...(facets && { facets: adaptFacets(facets, options) }),
    requestId,
    results: response.rawResults.map(r => {
      // eslint-disable-next-line
      const { _meta, ...rest } = r;
      return {
        ...rest
      };
    }),
    ...(totalPages !== undefined && { totalPages }),
    ...(totalResults !== undefined && { totalResults })
  };
}
