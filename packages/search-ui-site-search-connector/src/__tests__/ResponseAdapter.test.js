import { toResultList } from "../ResponseAdapter";
import ResultList from "../ResultList";

import response from "../../resources/example-response.json";

describe("ResponseAdapter", () => {
  describe("toResultList", () => {
    it("returns a ResultList", () => {
      expect(toResultList(response, "national-parks")).toBeInstanceOf(
        ResultList
      );
    });

    it("includes results", () => {
      const results = toResultList(response, "national-parks").results;
      expect(results).toHaveLength(2);
      expect(results[0].data).toEqual({
        nps_link: {
          raw: "https://www.nps.gov/acad/index.htm"
        },
        updated_at: {
          raw: "2018-11-13T21:51:11+00:00"
        },
        states: {
          raw: ["Maine"]
        },
        title: {
          raw: "Acadia",
          snippet: "<em>Acadia</em>"
        },
        external_id: {
          raw: "9000"
        },
        acres: {
          raw: 49057.36
        },
        id: {
          raw: "5beb474f8db2315427beecc7"
        }
      });
      expect(results[0].getRaw("title")).toEqual("Acadia");
      expect(results[0].getSnippet("title")).toEqual("<em>Acadia</em>");
    });
  });

  it("includes info", () => {
    const info = toResultList(response, "national-parks").info;
    expect(info).toEqual({
      meta: {
        warnings: [],
        page: {
          current: 1,
          total_pages: 1,
          size: 20,
          total_results: 2
        },
        request_id: ""
      },
      facets: {
        states: [
          {
            data: [
              {
                value: "Maine",
                count: 2
              }
            ],
            type: "value"
          }
        ]
      }
    });
  });
});
