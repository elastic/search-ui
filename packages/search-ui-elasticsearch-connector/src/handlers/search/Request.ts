import type { Filter, QueryConfig, RequestState } from "@elastic/search-ui";
import { MixedFilter } from "@searchkit/sdk";

export interface SearchkitVariables {
  query: string;
  filters: MixedFilter[];
  from: number;
  size: number;
  sort: string;
}

export function getFilters(
  filters: Filter[] = [],
  baseFilters: Filter[] = []
): MixedFilter[] {
  return filters.reduce((acc, f) => {
    const isBaseFilter = baseFilters.find((bf) => bf === f);
    if (isBaseFilter) return acc;

    const subFilters = f.values.map((v) => ({
      identifier: f.field,
      value: v
    }));

    return [...acc, ...subFilters];
  }, []);
}

function SearchRequest(
  state: RequestState,
  queryConfig: QueryConfig
): SearchkitVariables {
  return {
    query: state.searchTerm,
    filters: state.filters
      ? getFilters(state.filters, queryConfig.filters)
      : [],
    from: (state.current - 1) * state.resultsPerPage,
    size: state.resultsPerPage,
    sort: state.sortList?.length > 0 ? "selectedOption" : null
  };
}

export default SearchRequest;
