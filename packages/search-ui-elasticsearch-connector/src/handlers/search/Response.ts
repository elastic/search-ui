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
    totalPages: results.items.page.totalPages,
    pagingStart: results.items.page.pageNumber * results.items.page.size,
    pagingEnd: (results.items.page.pageNumber + 1) * results.items.page.size,
    wasSearched: false,
    totalResults: results.summary.total,
    facets,
    results: results.items.hits.map(fieldResponseMapper),
    requestId: null,
    rawResponse: null
  };
  return response;
}

export default SearchResponse;
