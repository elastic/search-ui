import type { RequestState, SuggestionConfiguration } from "@elastic/search-ui";
import { BaseQueryBuilder } from "./BaseQueryBuilder";
import { SearchRequest } from "../types";

export class SuggestionsAutocompleteBuilder extends BaseQueryBuilder {
  constructor(
    state: RequestState,
    private readonly configuration: SuggestionConfiguration,
    private readonly completionSize: number = 5
  ) {
    super(state);
  }

  build() {
    this.setSize(0);
    this.setSourceFields([]);
    this.setSuggest(this.buildSuggestion());

    return this.query;
  }

  private setSuggest(query: SearchRequest["suggest"]): void {
    if (query) {
      this.query.suggest = query;
    }
  }

  private buildSuggestion(): SearchRequest["suggest"] | null {
    if (!this.state.searchTerm) {
      return null;
    }

    const field = this.configuration.fields[0];

    return {
      suggest: {
        prefix: this.state.searchTerm,
        completion: {
          size: this.completionSize,
          skip_duplicates: true,
          field,
          fuzzy: {
            fuzziness: 1
          }
        }
      }
    };
  }
}
