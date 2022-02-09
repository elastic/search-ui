import { getFacets, getResults } from "./responseAdapters";

export default function adaptResponse(response: any, documentType: any) {
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
