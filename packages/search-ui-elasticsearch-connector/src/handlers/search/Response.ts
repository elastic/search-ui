import { ResponseState } from "@elastic/search-ui";
import { SearchkitResponse } from "@searchkit/sdk";
import { fieldResponseMapper } from "../common";

function SearchResponse(results: SearchkitResponse): ResponseState {
  const facets = results.facets.reduce((acc, facet) => {
    return {
      ...acc,
      [facet.identifier]: [
        {
          data: facet.entries.map((e) => ({
            value: e.label,
            count: e.count
          })),
          type: "value"
        }
      ]
    };
  }, {});

  const response: ResponseState = {
    resultSearchTerm: results.summary.query,
    totalPages: results.hits.page.totalPages,
    pagingStart: results.hits.page.pageNumber * results.hits.page.size,
    pagingEnd: (results.hits.page.pageNumber + 1) * results.hits.page.size,
    wasSearched: false,
    totalResults: results.summary.total,
    facets,
    results: results.hits.items.map(fieldResponseMapper),
    requestId: null,
    rawResponse: null
  };
  return response;
}

export default SearchResponse;
