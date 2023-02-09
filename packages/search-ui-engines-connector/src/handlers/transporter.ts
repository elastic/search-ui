import { SearchRequest, SearchResponse, Transporter } from "../types";

export class EngineTransporter implements Transporter {
  constructor(
    private host: string,
    private engineName: string,
    private apiKey: string
  ) {}

  async performRequest(requestBody: SearchRequest): Promise<SearchResponse> {
    if (!fetch)
      throw new Error("Fetch is not supported in this browser / environment");

    const response = await fetch(
      `${this.host}/api/engines/${this.engineName}/_search`,
      {
        method: "POST",
        body: JSON.stringify(requestBody),
        headers: {
          "Content-Type": "application/json",
          Authorization: `ApiKey ${this.apiKey}`
        }
      }
    );
    const json = await response.json();
    return json;
  }
}
