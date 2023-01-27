import { EngineTransporter } from "../transporter";
import nock from "nock";
import type { SearchRequest, SearchResponse } from "../../types";
import "cross-fetch/polyfill";

describe("EngineTransporter", () => {
  it("is a class", () => {
    expect(typeof EngineTransporter).toEqual("function");
  });

  it("perform a request", () => {
    const transporter = new EngineTransporter(
      "http://localhost:9200",
      "my_engine",
      "apikey"
    );

    const body = {
      query: {
        match_all: {}
      }
    };

    nock("http://localhost:9200", {
      reqheaders: {
        authorization: "ApiKey apikey"
      }
    })
      .post("/api/engines/my_engine/_search")
      .reply(200, () => ({
        hits: {
          hits: [
            {
              _id: "1",
              _source: {
                title: "My title"
              }
            }
          ]
        }
      }));

    return transporter
      .performRequest({
        body
      } as SearchRequest)
      .then((response: SearchResponse) => {
        expect(response.hits.hits).toHaveLength(1);
        expect(response.hits.hits[0]._id).toEqual("1");
        expect(response.hits.hits[0]._source.title).toEqual("My title");
      });
  });
});
