import { ConnectionOptions } from "../types";
import { LIB_VERSION } from "../version";
import { RequestBody, ResponseBody } from "./types";
import { getHostFromCloud } from "./utils";

const jsVersion = typeof window !== "undefined" ? "browser" : process.version;
const metaHeader = `ent=${LIB_VERSION}-es-connector,js=${jsVersion},t=${LIB_VERSION}-es-connector,ft=universal`;

export interface IApiClientTransporter {
  headers: Record<string, string>;
  performRequest(requestBody: RequestBody): Promise<ResponseBody>;
}

export class ApiClientTransporter implements IApiClientTransporter {
  headers: Record<string, string>;

  constructor(private config: ConnectionOptions) {
    this.headers = {
      "x-elastic-client-meta": metaHeader,
      ...(this.config.connectionOptions?.headers || {})
    };
  }

  async performRequest(requestBody: RequestBody): Promise<ResponseBody> {
    if (!fetch)
      throw new Error("Fetch is not supported in this browser / environment");

    if (!this.config.host && !this.config.cloud) {
      throw new Error("Host or cloud is required");
    }

    let host = this.config.host;

    if (this.config.cloud) {
      host = getHostFromCloud(this.config.cloud);
    }

    const response = await fetch(host + "/" + this.config.index + "/_search", {
      method: "POST",
      body: JSON.stringify(requestBody),
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
