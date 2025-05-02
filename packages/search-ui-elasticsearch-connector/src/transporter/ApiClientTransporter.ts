import { ConnectionOptions } from "../types";
import { LIB_VERSION } from "../version";
import { getHostFromCloud } from "../utils";
import type { SearchRequest, ResponseBody } from "../types";

const jsVersion = typeof window !== "undefined" ? "browser" : process.version;
const metaHeader = `ent=${LIB_VERSION}-es-connector,js=${jsVersion},t=${LIB_VERSION}-es-connector,ft=universal`;

export interface IApiClientTransporter {
  headers: Record<string, string>;
  performRequest(searchRequest: SearchRequest): Promise<ResponseBody>;
}

export class ApiClientTransporter implements IApiClientTransporter {
  headers: Record<string, string>;

  constructor(private config: ConnectionOptions) {
    this.validateConfig();

    this.headers = {
      "x-elastic-client-meta": metaHeader,
      ...(this.config.connectionOptions?.headers || {})
    };
  }

  private validateConfig(): void {
    if (!this.config.index) {
      throw new Error("Index name is required");
    }

    if (!this.config.host && !this.config.cloud) {
      throw new Error("Either host or cloud configuration must be provided");
    }

    if (this.config.host) {
      try {
        new URL(this.config.host);
      } catch (e) {
        throw new Error("Invalid host URL format");
      }
    }

    if (this.config.cloud) {
      if (!this.config.cloud.id) {
        throw new Error("Cloud ID is required");
      }

      if (!this.config.cloud.id.includes(":")) {
        throw new Error("Invalid cloud ID format");
      }
    }
  }

  async performRequest(searchRequest: SearchRequest): Promise<ResponseBody> {
    if (!fetch)
      throw new Error("Fetch is not supported in this browser / environment");

    let host = this.config.host;

    if (this.config.cloud) {
      host = getHostFromCloud(this.config.cloud);
    }

    const searchUrl = new URL(`/${this.config.index}/_search`, host);

    const response = await fetch(searchUrl.href, {
      method: "POST",
      body: JSON.stringify(searchRequest),
      headers: {
        "Content-Type": "application/json",
        ...this.headers,
        ...(this.config?.apiKey
          ? { Authorization: `ApiKey ${this.config.apiKey}` }
          : {})
      }
    });
    const json = await response.json();

    return json;
  }
}
