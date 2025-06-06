import type {
  APIConnector,
  RequestState,
  QueryConfig,
  ResponseState,
  AutocompleteQueryConfig,
  AutocompleteResponseState
} from "@elastic/search-ui";

interface ApiProxyConnectorOptions {
  basePath?: string;
  fetchOptions?: RequestInit;
}

export default class ApiProxyConnector implements APIConnector {
  private readonly basePath: string;
  private readonly fetchOptions: RequestInit;

  constructor({
    basePath = "/api",
    fetchOptions = {}
  }: ApiProxyConnectorOptions = {}) {
    this.basePath = basePath;
    this.fetchOptions = fetchOptions;
  }

  private async request<T>(endpoint: string, body: unknown): Promise<T> {
    const response = await fetch(`${this.basePath}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...this.fetchOptions.headers
      },
      ...this.fetchOptions,
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      throw new Error(
        `APIProxyConnector request failed: ${response.statusText}`
      );
    }

    return response.json() as Promise<T>;
  }

  async onSearch(
    state: RequestState,
    queryConfig: QueryConfig
  ): Promise<ResponseState> {
    return this.request<ResponseState>("/search", {
      state,
      queryConfig
    });
  }

  async onAutocomplete(
    state: RequestState,
    queryConfig: AutocompleteQueryConfig
  ): Promise<AutocompleteResponseState> {
    return this.request<AutocompleteResponseState>("/autocomplete", {
      state,
      queryConfig
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onResultClick(): void {}

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onAutocompleteResultClick(): void {}
}
