import { adaptResponse } from "../responseAdapter";
import exampleResponse from "./exampleResponse.json";

const deepClone = (obj) => JSON.parse(JSON.stringify(obj));

const emptyResponse = {
  meta: {
    page: {
      current: 1,
      total_pages: 0,
      total_results: 0,
      size: 5
    },
    warnings: [],
    sources: {
      "621581b6174a804659f9dc16": {
        name: "National parks",
        service_type: "custom"
      }
    },
    request_id: "wVlg15HbT0yyHJSJUlnHQw"
  },
  results: []
};

describe("adaptResponse", () => {
  it("adapts response", () => {
    expect(adaptResponse(exampleResponse)).toMatchSnapshot();
  });

  it("adapts empty response", () => {
    expect(adaptResponse(emptyResponse)).toMatchSnapshot();
  });

  it("adapts facets with empty values", () => {
    const responseWithEmptyFacetValue = deepClone(exampleResponse);
    responseWithEmptyFacetValue.facets.world_heritage_site[0].data[0].value =
      "";
    expect(adaptResponse(responseWithEmptyFacetValue)).toMatchSnapshot();
  });

  it("adapts facets with zero values", () => {
    const responseWithZeroFacetValue = deepClone(exampleResponse);
    responseWithZeroFacetValue.facets.world_heritage_site[0].data[0].value =
      0 as any;
    expect(adaptResponse(responseWithZeroFacetValue)).toMatchSnapshot();
  });

  it("will accept additional facet value fields to inject into response", () => {
    const geoOptions = {
      additionalFacetValueFields: {
        location: {
          center: "73.102, -78.120",
          unit: "u"
        }
      }
    };
    expect(adaptResponse(exampleResponse, geoOptions)).toMatchSnapshot();
  });

  it("will limit total pages to 100", () => {
    const responseWithOver100Pages = deepClone(exampleResponse);
    responseWithOver100Pages.meta.page = {
      current: 1,
      total_pages: 5000,
      total_results: 100000,
      size: 20
    };
    expect(adaptResponse(responseWithOver100Pages)).toMatchSnapshot();
  });
});
