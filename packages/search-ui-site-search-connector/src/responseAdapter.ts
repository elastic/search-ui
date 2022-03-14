import { getFacets, getResults } from "./responseAdapters";
import type { SearchResponse } from "./types";

export default function adaptResponse(
  response: SearchResponse,
  documentType: string
) {
  const results = getResults(response.records, documentType);
  const totalPages = response.info[documentType].num_pages;
  const totalResults = response.info[documentType].total_result_count;
  const requestId = "";
  const facets = getFacets(response.info[documentType]);

  return {
    rawResponse: response,
    results,
    totalPages,
    totalResults,
    requestId,
    ...(Object.keys(facets).length > 0 && { facets })
  };
}
