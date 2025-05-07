import { getHostFromCloud } from "../utils";

describe("Utils Node.js Tests", () => {
  it("should correctly decode cloud ID in Node.js environment", () => {
    const testCloudId =
      "some-search-build:c29tZWNsb3VkaG9zdDo0NDMkcmFuZG9tSWQkc29tZWluZm8=";

    // Spy on Buffer.from
    const bufferSpy = jest.spyOn(Buffer, "from");
    const result = getHostFromCloud({ id: testCloudId });

    expect(bufferSpy).toHaveBeenCalled();
    expect(result).toBe("https://randomId.somecloudhost:443");

    bufferSpy.mockRestore();
  });
});
