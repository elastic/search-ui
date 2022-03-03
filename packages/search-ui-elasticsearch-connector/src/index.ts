import type {
  QueryConfig,
  RequestState,
  SearchState,
  AutocompleteQuery
} from "@elastic/search-ui";

import { handleAutocompleteRequest, handleSearchRequest } from "./core";

export { default as ServerConnector } from "./express-connector/server";
export { default as ClientConnector } from "./express-connector/client";

type ConnectionOptions = {
  host: string;
  index: string;
  apiKey?: string;
};

type SearchConfiguration = {
  queryFields: string[];
};

class APIConnector {
  constructor(
    private config: ConnectionOptions,
    private searchConfig: SearchConfiguration
  ) {}

  onResultClick(): void {
    console.error("not implemented");
  }

  onAutocompleteResultClick(): void {
    console.error("not implemented");
  }

  async onSearch(
    state: RequestState,
    queryConfig: QueryConfig
  ): Promise<SearchState> {
    return handleSearchRequest(
      state,
      queryConfig,
      this.config.host,
      this.config.index,
      this.config.apiKey,
      this.searchConfig.queryFields
    );
  }

  async onAutocomplete(
    state: RequestState,
    queryConfig: AutocompleteQuery
  ): Promise<SearchState> {
    return handleAutocompleteRequest(
      state,
      queryConfig,
      this.config.host,
      this.config.index,
      this.config.apiKey,
      this.searchConfig.queryFields
    );
  }
}

export default APIConnector;
