import type { Facet, FacetValue } from "@elastic/search-ui";

function adaptation1AdaptFacetValue(
  facetValue: FacetValue,
  additionalFacetValueFieldsForField = {}
) {
  const hasValue = Object.prototype.hasOwnProperty.call(facetValue, "value");
  const { count, value, ...rest } = facetValue;
  return {
    count,
    // TODO: Looks like a bug.
    // "value" type is
    // FilterValue | { selected: boolean; }
    // Doesn't look like { selected: boolean; } is the correct return type
    // Also, when testing locally, the "selected" property never appears
    value: hasValue
      ? value
      : {
          ...rest,
          ...additionalFacetValueFieldsForField
        }
  };
}

// Should be facet: Facet, but this results in a type error, see description above
function adaptation2AddLabelToFacet(fieldName: string, facet) {
  return {
    field: fieldName,
    ...facet
  };
}

function adaptFacets(
  facets: Record<string, Facet[]>,
  { additionalFacetValueFields = {} }
) {
  if (!facets || Object.keys(facets).length === 0) return facets;

  return Object.entries(facets).reduce((acc, [fieldName, facet]) => {
    const adaptedFacet = facet.map((v) => {
      const { type, data, ...rest } = v;
      return adaptation2AddLabelToFacet(fieldName, {
        type,
        data: data.map((f) =>
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

function limitTo100pages(totalPages: number): number {
  // We limit this to 100 pages since App Search currently cannot page past 100 pages
  return Math.min(totalPages, 100);
}

export function adaptResponse(response, options = {}) {
  const facets = response.facets;
  const requestId = response.meta.request_id;

  const totalPages =
    response.meta.page && typeof response.meta.page.total_pages !== "undefined"
      ? limitTo100pages(response.meta.page.total_pages)
      : undefined;

  const totalResults = response.meta.page
    ? response.meta.page.total_results
    : undefined;

  return {
    ...(facets && { facets: adaptFacets(facets, options) }),
    rawResponse: response,
    requestId,
    results: response.results,
    ...(totalPages !== undefined && { totalPages }),
    ...(totalResults !== undefined && { totalResults })
  };
}
