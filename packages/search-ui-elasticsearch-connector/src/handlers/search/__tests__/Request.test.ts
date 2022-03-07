import { RequestState } from "@elastic/search-ui";
import SearchRequest, { getFilters } from "../Request";

describe("Search - Request", () => {
  const requestState: RequestState = {
    searchTerm: "test",
    current: 1,
    resultsPerPage: 10,
    sortList: [{ field: "test", direction: "asc" }],
    filters: [
      {
        field: "test",
        values: ["test", "test2"],
        type: "any"
      }
    ]
  };

  it("should transform SearchUI RequestState into Searchkit State", () => {
    expect(SearchRequest(requestState)).toEqual({
      query: "test",
      filters: [
        {
          identifier: "test",
          value: "test"
        },
        {
          identifier: "test",
          value: "test2"
        }
      ],
      from: 0,
      size: 10,
      sort: "selectedOption"
    });
  });

  it("sort should be null when no sort option selected", () => {
    expect(
      SearchRequest({
        ...requestState,
        sortList: []
      }).sort
    ).toBeNull();
  });

  it("page from should be adjusted on second page", () => {
    expect(
      SearchRequest({
        ...requestState,
        resultsPerPage: 100,
        current: 2 // second page
      })
    ).toEqual(
      expect.objectContaining({
        from: 100,
        size: 100
      })
    );
  });

  describe("getFilters()", () => {
    it("should return empty array when no filters", () => {
      expect(getFilters([])).toEqual([]);
    });

    it("should return multiple searchkit filters", () => {
      expect(
        getFilters([
          {
            field: "test",
            values: ["test", "test2"],
            type: "any"
          }
        ])
      ).toEqual([
        {
          identifier: "test",
          value: "test"
        },
        {
          identifier: "test",
          value: "test2"
        }
      ]);
    });
  });
});
