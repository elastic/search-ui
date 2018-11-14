import SiteSearchAPIConnector from "..";

describe("SiteSearchAPIConnector", () => {
  const params = {
    documentType: "national-parks",
    engineKey: "12345"
  };

  const mockClient = {
    search: jest.fn().mockReturnValue({ then: cb => cb(resultList) }),
    click: jest.fn().mockReturnValue(Promise.resolve())
  };

  beforeEach(() => {
    mockClient.search = jest.fn().mockReturnValue({ then: cb => cb() });
    mockClient.click = jest.fn().mockReturnValue({ then: () => {} });
  });

  it("can be initialized", () => {
    const connector = new SiteSearchAPIConnector(params);
    expect(connector).toBeInstanceOf(SiteSearchAPIConnector);
  });
});
