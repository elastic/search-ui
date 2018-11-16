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
        description: {
          raw:
            "The park protects a quarter of the Gunnison River, which slices sheer canyon walls from dark Precambrian-era rock. The canyon features some of the steepest cliffs and oldest rock in North America, and is a popular site for river rafting and rock climbing. The deep, narrow canyon is composed of gneiss and schist which appears black when in shadow."
        },
        nps_link: { raw: "https://www.nps.gov/blca/index.htm" },
        states: { raw: ["Colorado"] },
        title: { raw: "Black Canyon of the Gunnison" },
        id: { raw: "park_black-canyon-of-the-gunnison" },
        visitors: { raw: 238018 },
        world_heritage_site: { raw: false },
        location: { raw: "38.57,-107.72" },
        acres: { raw: 30749.75 },
        square_km: { raw: 124.4 },
        date_established: { raw: "1999-10-21T05:00:00Z" }
      });
      expect(results[0].getRaw("title")).toEqual(
        "Black Canyon of the Gunnison"
      );
      //expect(results[0].getSnippet("title")).toEqual("<em>Acadia</em>");
    });

    it("includes info", () => {
      const info = toResultList(response).info;
      expect(info).toEqual({
        meta: {
          warnings: [],
          page: {
            current: 1,
            total_pages: 10,
            size: 10,
            total_results: 2
          },
          request_id: ""
        }
        // facets: { TODO
        //   states: [
        //     {
        //       data: [
        //         {
        //           value: "Maine",
        //           count: 2
        //         }
        //       ],
        //       type: "value"
        //     }
        //   ]
        // }
      });
    });
  });
});
