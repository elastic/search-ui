import { ApiClientTransporter } from "../ApiClientTransporter";
import type {
  ConnectionOptions,
  SearchRequest,
  ResponseBody
} from "../../types";
import { getHostFromCloud } from "../../utils";

jest.mock("../../utils", () => ({
  getHostFromCloud: jest.fn()
}));

describe("ApiClientTransporter", () => {
  const mockFetch = jest.fn();
  global.fetch = mockFetch;

  beforeEach(() => {
    mockFetch.mockClear();
    (getHostFromCloud as jest.Mock).mockClear();
  });

  const createTransporter = (config: Partial<ConnectionOptions> = {}) => {
    return new ApiClientTransporter({
      host: "http://localhost:9200",
      index: "test-index",
      ...config
    });
  };

  const mockResponse: ResponseBody = {
    took: 1,
    timed_out: false,
    _shards: {
      total: 1,
      successful: 1,
      skipped: 0,
      failed: 0
    },
    hits: {
      total: { value: 1, relation: "eq" },
      hits: []
    }
  };

  it("should make a request with correct headers", async () => {
    const transporter = createTransporter();
    const searchRequest: SearchRequest = { query: { match_all: {} } };

    mockFetch.mockResolvedValueOnce({
      json: () => Promise.resolve(mockResponse)
    });

    await transporter.performRequest(searchRequest);

    expect(mockFetch).toHaveBeenCalledWith(
      "http://localhost:9200/test-index/_search",
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({
          "Content-Type": "application/json",
          "x-elastic-client-meta": expect.any(String)
        }),
        body: JSON.stringify(searchRequest)
      })
    );
  });

  it("should include api key in headers when provided", async () => {
    const transporter = createTransporter({
      apiKey: "test-api-key"
    });

    mockFetch.mockResolvedValueOnce({
      json: () => Promise.resolve(mockResponse)
    });

    await transporter.performRequest({ query: { match_all: {} } });

    expect(mockFetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: "ApiKey test-api-key"
        })
      })
    );
  });

  it("should use cloud host when cloud config is provided", async () => {
    const cloudConfig = {
      id: "test-cloud-id:additionalParam"
    };

    (getHostFromCloud as jest.Mock).mockReturnValue("https://cloud-host.com");

    const transporter = createTransporter({
      cloud: cloudConfig
    });

    mockFetch.mockResolvedValueOnce({
      json: () => Promise.resolve(mockResponse)
    });

    await transporter.performRequest({ query: { match_all: {} } });

    expect(getHostFromCloud).toHaveBeenCalledWith(cloudConfig);
    expect(mockFetch).toHaveBeenCalledWith(
      "https://cloud-host.com/test-index/_search",
      expect.any(Object)
    );
  });

  it("should throw error when cloud id has wrong format", () => {
    expect(() =>
      createTransporter({
        cloud: { id: "test-cloud-id" }
      })
    ).toThrow("Invalid cloud ID format");
  });

  it("should throw error when neither host nor cloud is provided", () => {
    expect(() =>
      createTransporter({
        host: undefined,
        cloud: undefined
      })
    ).toThrow("Either host or cloud configuration must be provided");
  });

  it("should throw error when fetch is not available", async () => {
    const transporter = createTransporter();
    const originalFetch = global.fetch;
    global.fetch = undefined;

    try {
      await expect(
        transporter.performRequest({ query: { match_all: {} } })
      ).rejects.toThrow("Fetch is not supported in this browser / environment");
    } finally {
      global.fetch = originalFetch;
    }
  });

  it("should include custom headers when provided", async () => {
    const customHeaders = {
      "X-Custom-Header": "test-value"
    };

    const transporter = createTransporter({
      connectionOptions: {
        headers: customHeaders
      }
    });

    mockFetch.mockResolvedValueOnce({
      json: () => Promise.resolve(mockResponse)
    });

    await transporter.performRequest({ query: { match_all: {} } });

    expect(mockFetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        headers: expect.objectContaining(customHeaders)
      })
    );
  });

  it("should return response body from elasticsearch", async () => {
    const transporter = createTransporter();
    const searchRequest: SearchRequest = { query: { match_all: {} } };

    mockFetch.mockResolvedValueOnce({
      json: () => Promise.resolve(mockResponse)
    });

    const response = await transporter.performRequest(searchRequest);

    expect(response).toEqual(mockResponse);
  });
});
