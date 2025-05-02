import { getHostFromCloud } from "../utils";

describe("Utils Browser Tests", () => {
  it("should correctly decode cloud ID in browser environment", () => {
    const testCloudId =
      "some-search-build:c29tZWNsb3VkaG9zdDo0NDMkcmFuZG9tSWQkc29tZWluZm8=";

    // Spy on atob
    const atobSpy = jest.spyOn(window, "atob");
    const result = getHostFromCloud({ id: testCloudId });

    expect(atobSpy).toHaveBeenCalled();
    expect(result).toBe("https://randomId.somecloudhost:443");

    atobSpy.mockRestore();
  });
});
