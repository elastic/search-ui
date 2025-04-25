import type { AutocompleteQueryConfig, RequestState } from "@elastic/search-ui";
import { BaseQueryBuilder } from "./BaseQueryBuilder";
import { getQueryFields } from "../utils";
import { SearchRequest } from "../types";

export class AutocompleteQueryBuilder extends BaseQueryBuilder {
  constructor(
    state: RequestState,
    private readonly queryConfig: AutocompleteQueryConfig
  ) {
    super(state);
  }

  build() {
    this.setSourceFields(
      Object.keys(this.queryConfig.results?.result_fields || {})
    );
    this.setQuery(this.buildQuery());

    return this.query;
  }

  private buildQuery(): SearchRequest["query"] | null {
    if (!this.state.searchTerm) {
      return null;
    }

    const fields = getQueryFields(
      this.queryConfig.results?.search_fields || {}
    );

    return {
      bool: {
        must: [
          {
            multi_match: {
              query: this.state.searchTerm,
              type: "bool_prefix",
              fields
            }
          }
        ]
      }
    };
  }
}
