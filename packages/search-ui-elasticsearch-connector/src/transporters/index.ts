import { RequestBody } from "@elastic/elasticsearch-types";
import { SearchkitConfig } from "../Request/Request";

export function getHostFromCloud(cloud: { id: string }): string {
  const { id } = cloud;
  // the cloud id is `cluster-name:base64encodedurl`
  // the url is a string divided by two '$', the first is the cloud url
  // the second the elasticsearch instance, the third the kibana instance
  const cloudUrls = atob(id.split(":")[1]).split("$");
  return `https://${cloudUrls[1]}.${cloudUrls[0]}`;
}

export interface SearchkitTransporterOverrides {
  index?: string;
}

export interface SearchkitTransporter {
  performRequest(
    requestBody,
    overrides?: SearchkitTransporterOverrides
  ): Promise<any>;
}

export class FetchClientTransporter implements SearchkitTransporter {
  constructor(private config: SearchkitConfig) {}

  async performRequest(
    requestBody: RequestBody,
    overrides: SearchkitTransporterOverrides = {}
  ): Promise<any> {
    if (!fetch)
      throw new Error("Fetch is not supported in this browser / environment");

    if (!this.config.host && !this.config.cloud) {
      throw new Error("Host or cloud is required");
    }

    let host = this.config.host;

    if (this.config.cloud) {
      host = getHostFromCloud(this.config.cloud);
    }

    const { index = this.config.index } = overrides;
    const response = await fetch(host + "/" + index + "/_search", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
        ...(this.config.connectionOptions?.headers || {}),
        ...(this.config.connectionOptions?.apiKey
          ? { Authorization: `ApiKey ${this.config.connectionOptions.apiKey}` }
          : {})
      }
    });
    const json = await response.json();
    return json;
  }
}
