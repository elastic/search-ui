import runRequest from "./runRequest";
import buildRequest from "./buildRequest";

function combineAggregationsFromResponses(responses) {
  return responses.reduce((acc, response) => {
    return {
      ...acc,
      ...response.aggregations
    };
  }, {});
}

// To calculate a disjunctive facet correctly, you need to calculate the facet counts as if the filter was
// not applied. If you did not do this, list of facet values would collapse to just one value, which is
// whatever you have filtered on in that facet.
function removeFilterByName(state, facetName) {
  return {
    ...state,
    filters: state.filters.filter(f => f.field !== facetName)
  };
}

function removeAllFacetsExcept(body, facetName) {
  return {
    ...body,
    aggs: {
      [facetName]: body.aggs[facetName]
    }
  };
}

function changeSizeToZero(body) {
  return {
    ...body,
    size: 0
  };
}

async function getDisjunctiveFacetCounts(state, disunctiveFacetNames) {
  const responses = await Promise.all(
    // Note that this could be optimized by *not* executing a request
    // if not filter is currently applied for that field. Kept simple here for clarity.
    disunctiveFacetNames.map(facetName => {
      let newState = removeFilterByName(state, facetName);
      let body = buildRequest(newState);
      body = changeSizeToZero(body);
      body = removeAllFacetsExcept(body, facetName);
      return runRequest(body);
    })
  );
  return combineAggregationsFromResponses(responses);
}

/**
 * This function will re-calculate facets that need to be considered
 * "disjunctive" (also known as "sticky"). Calculating sticky facets correctly
 * requires a second query for each sticky facet.
 *
 * @param {*} json
 * @param {*} state
 * @param {string[]} disunctiveFacetNames
 *
 * @return {Promise<Object>} A map of updated aggregation counts for the specified facet names
 */
export default async function applyDisjunctiveFaceting(
  json,
  state,
  disunctiveFacetNames
) {
  const disjunctiveFacetCounts = await getDisjunctiveFacetCounts(
    state,
    disunctiveFacetNames
  );

  return {
    ...json,
    aggregations: {
      ...json.aggregations,
      ...disjunctiveFacetCounts
    }
  };
}
