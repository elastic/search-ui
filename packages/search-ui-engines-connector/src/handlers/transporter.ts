import type { SearchkitTransporter } from "@searchkit/sdk";
import { SearchRequest, SearchResponse, EngineRouteFn } from "../types";

function defaultEngineRoute(host: string, engineName: string): string {
  return `${host}/api/engines/${engineName}/_search`;
}

export class EngineTransporter implements SearchkitTransporter {
  constructor(
    private host: string,
    private engineName: string,
    private apiKey: string,
    private getRoute: EngineRouteFn = defaultEngineRoute
  ) {}

  async performRequest(requestBody: SearchRequest): Promise<SearchResponse> {
    if (!fetch)
      throw new Error("Fetch is not supported in this browser / environment");

    const response = await fetch(this.getRoute(this.host, this.engineName), {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
        Authorization: `ApiKey ${this.apiKey}`
      }
    });
    const json = await response.json();
    return json;
  }
}
