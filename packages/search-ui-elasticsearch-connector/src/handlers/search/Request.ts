import { Filter, RequestState } from "@elastic/search-ui";
import { MixedFilter } from "@searchkit/sdk";

export interface SearchkitVariables {
  query: string;
  filters: MixedFilter[];
  from: number;
  size: number;
  sort: string;
}

export function getFilters(filters: Filter[]): MixedFilter[] {
  return filters.reduce((acc, f) => {
    const subFilters = f.values.map((v) => ({
      identifier: f.field,
      value: v
    }));

    return [...acc, ...subFilters];
  }, []);
}

function SearchRequest(state: RequestState): SearchkitVariables {
  return {
    query: state.searchTerm,
    filters: state.filters ? getFilters(state.filters) : [],
    from: (state.current - 1) * state.resultsPerPage,
    size: state.resultsPerPage,
    sort: state.sortList?.length > 0 ? "selectedOption" : null
  };
}

export default SearchRequest;
