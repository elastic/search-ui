import { QueryConfig, RequestState } from "@elastic/search-ui";
import { BaseFilter, buildBaseFilters } from "./FilterTransform";
import { Sort } from "./types";

export class QueryManager {
  private query: string;
  private baseFilters: BaseFilter[];
  private sortBy: Sort;

  constructor(state: RequestState, queryConfig: QueryConfig) {
    this.setQuery(state.searchTerm);
    this.setBaseFilters(queryConfig.filters);
    this.setSortBy(state.sortList, state.sortField, state.sortDirection);
  }

  getQuery() {
    return this.query;
  }

  setQuery(query: string): void {
    this.query = query;
  }

  setBaseFilters(filters: QueryConfig["filters"]): void {
    this.baseFilters = buildBaseFilters(filters);
  }

  getBaseFilters(): BaseFilter[] {
    return this.baseFilters;
  }

  setSortBy(
    sortList: QueryConfig["sortList"],
    sortField: string | undefined | null,
    sortDirection: string | undefined | null
  ): void {
    let sortValue: any = "_score";

    if (sortList?.length) {
      sortValue = sortList.map((s) => ({
        [s.field]: s.direction
      }));
    } else if (sortField && sortDirection) {
      sortValue = { [sortField]: sortDirection };
    }

    this.sortBy = sortValue;
  }

  getSort(): Sort {
    return this.sortBy;
  }
}
