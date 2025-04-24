import type {
  RequestState,
  ResultSuggestionConfiguration
} from "@elastic/search-ui";
import { BaseQueryBuilder } from "./BaseQueryBuilder";
import { getQueryFields } from "../ElasticsearchQueryTransformer/utils";
import { SearchRequest } from "../types";

export class ResultsAutocompleteBuilder extends BaseQueryBuilder {
  constructor(
    state: RequestState,
    private readonly configuration: Pick<
      ResultSuggestionConfiguration,
      "result_fields" | "search_fields"
    >,
    private readonly size: number = 5
  ) {
    super(state);
  }

  build() {
    this.setSize(this.size);
    this.setSourceFields(Object.keys(this.configuration.result_fields || {}));
    this.setHighlight(this.buildHighlight());
    this.setQuery(this.buildQuery());

    return this.query;
  }

  private buildHighlight() {
    const highlightFields = Object.entries(
      this.configuration.result_fields
    ).reduce((acc, [fieldKey, fieldConfiguration]) => {
      if (fieldConfiguration.snippet) {
        acc[fieldKey] = {};
      }
      return acc;
    }, {});

    return Object.keys(highlightFields).length > 0
      ? { fields: highlightFields }
      : null;
  }

  private buildQuery(): SearchRequest["query"] | null {
    if (!this.state.searchTerm) {
      return null;
    }

    const fields = getQueryFields(this.configuration.search_fields || {});

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
