import queryString from "query-string";

class WorkplaceSearchAPIConnector {
  constructor({ clientId, redirectUri, kibanaBase, enterpriseSearchBase }) {
    const parsed = queryString.parse(window.location.hash);
    const accessToken = parsed.access_token;

    this.clientId = clientId;
    this.redirectUri = redirectUri;
    this.kibanaBase = kibanaBase;
    this.enterpriseSearchBase = enterpriseSearchBase;
    this.accessToken = accessToken;
  }

  async onSearch(state) {
    const searchResponse = await fetch(
      `${this.enterpriseSearchBase}/api/ws/v1/search`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.accessToken}`
        },
        body: JSON.stringify({
          query: state.searchTerm
        })
      }
    ).then(response => response.json());

    return searchResponse;
  }
}

export default WorkplaceSearchAPIConnector;
