class WorkplaceSearchAPIConnector {
  constructor({ clientId, redirectUri, endpointBase }) {
    this.clientId = clientId;
    this.redirectUri = redirectUri;
    this.endpointBase = endpointBase;
  }

  async onSearch() {
    const searchResponse = await fetch(
      `${this.endpointBase}/api/ws/v1/search`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.clientId}`
        }
      }
    );

    return searchResponse;
  }
}

export default WorkplaceSearchAPIConnector;
