import {
  transformFilter,
  transformFacet,
  transformFacetToAggs
} from "../filterTransformer";
import type {
  Filter as SearchUIFilter,
  FilterValueRange as SearchUIFilterValueRange,
  FacetConfiguration
} from "@elastic/search-ui";

describe("filterTransformer", () => {
  describe("transformFilter", () => {
    it("should transform 'all' type filter", () => {
      const filter: SearchUIFilter = {
        field: "category",
        values: ["electronics", "books"],
        type: "all"
      };

      const result = transformFilter(filter);

      expect(result).toEqual({
        bool: {
          filter: [
            { term: { category: "electronics" } },
            { term: { category: "books" } }
          ]
        }
      });
    });

    it("should transform 'any' type filter", () => {
      const filter: SearchUIFilter = {
        field: "category",
        values: ["electronics", "books"],
        type: "any"
      };

      const result = transformFilter(filter);

      expect(result).toEqual({
        bool: {
          should: [
            { term: { category: "electronics" } },
            { term: { category: "books" } }
          ]
        }
      });
    });

    it("should transform 'none' type filter", () => {
      const filter: SearchUIFilter = {
        field: "category",
        values: ["electronics", "books"],
        type: "none"
      };

      const result = transformFilter(filter);

      expect(result).toEqual({
        bool: {
          must_not: [
            { term: { category: "electronics" } },
            { term: { category: "books" } }
          ]
        }
      });
    });

    it("should transform range filter", () => {
      const filter: SearchUIFilter = {
        field: "price",
        values: [
          { from: 10, to: 20 } as SearchUIFilterValueRange,
          { from: 30, to: 40 } as SearchUIFilterValueRange
        ],
        type: "all"
      };

      const result = transformFilter(filter);

      expect(result).toEqual({
        bool: {
          filter: [
            { range: { price: { gte: 10, lte: 20 } } },
            { range: { price: { gte: 30, lte: 40 } } }
          ]
        }
      });
    });
  });

  describe("transformFacet", () => {
    it("should transform value facet", () => {
      const filter: SearchUIFilter = {
        field: "category",
        values: ["electronics", "books"],
        type: "all"
      };

      const facetConfig: FacetConfiguration = {
        type: "value"
      };

      const result = transformFacet(filter, facetConfig);

      expect(result).toEqual({
        bool: {
          filter: [
            { term: { category: "electronics" } },
            { term: { category: "books" } }
          ]
        }
      });
    });

    it("should transform disjunctive value facet", () => {
      const filter: SearchUIFilter = {
        field: "category",
        values: ["electronics", "books"],
        type: "any"
      };

      const facetConfig: FacetConfiguration = {
        type: "value"
      };

      const result = transformFacet(filter, facetConfig);

      expect(result).toEqual({
        bool: {
          should: [
            { term: { category: "electronics" } },
            { term: { category: "books" } }
          ]
        }
      });
    });

    it("should transform range facet", () => {
      const filter: SearchUIFilter = {
        field: "price",
        values: ["0-100", "100-200"],
        type: "all"
      };

      const facetConfig: FacetConfiguration = {
        type: "range",
        ranges: [
          { name: "0-100", from: 0, to: 100 },
          { name: "100-200", from: 100, to: 200 }
        ]
      };

      const result = transformFacet(filter, facetConfig);

      expect(result).toEqual({
        bool: {
          filter: [
            { range: { price: { gte: 0, lte: 100 } } },
            { range: { price: { gte: 100, lte: 200 } } }
          ]
        }
      });
    });

    it("should transform range facet with custom range values", () => {
      const filter: SearchUIFilter = {
        field: "price",
        values: [{ from: 50, to: 150, name: "base" }, { name: "100-200" }],
        type: "all"
      };

      const facetConfig: FacetConfiguration = {
        type: "range",
        ranges: [
          { name: "0-100", from: 0, to: 100 },
          { name: "100-200", from: 100, to: 200 }
        ]
      };

      const result = transformFacet(filter, facetConfig);

      expect(result).toEqual({
        bool: {
          filter: [
            { range: { price: { gte: 50, lte: 150 } } },
            { range: { price: { gte: 100, lte: 200 } } }
          ]
        }
      });
    });

    it("should transform geo distance facet", () => {
      const filter: SearchUIFilter = {
        field: "location",
        values: ["0-1km", { name: "1-2km", from: 1, to: 2 }],
        type: "none"
      };

      const facetConfig: FacetConfiguration = {
        type: "range",
        center: "0,0",
        unit: "km",
        ranges: [
          { name: "0-1km", from: 0, to: 1 },
          { name: "1-2km", from: 1, to: 2 },
          { name: "2-3km", from: 2, to: 3 }
        ]
      };

      const result = transformFacet(filter, facetConfig);

      expect(result).toEqual({
        bool: {
          must_not: [
            {
              bool: {
                must: [
                  {
                    geo_distance: {
                      distance: "1km",
                      location: "0,0"
                    }
                  }
                ]
              }
            },
            {
              bool: {
                must: [
                  {
                    geo_distance: {
                      distance: "2km",
                      location: "0,0"
                    }
                  }
                ],
                must_not: [
                  {
                    geo_distance: {
                      distance: "1km",
                      location: "0,0"
                    }
                  }
                ]
              }
            }
          ]
        }
      });
    });
  });

  describe("transformFacetToAggs", () => {
    it("should transform value facet to terms aggregation", () => {
      const facetConfig: FacetConfiguration = {
        type: "value",
        size: 10,
        sort: "count"
      };

      const result = transformFacetToAggs("category", facetConfig);

      expect(result).toEqual({
        terms: {
          field: "category",
          size: 10,
          order: { _count: "desc" }
        }
      });
    });

    it("should transform range facet to filters aggregation", () => {
      const facetConfig: FacetConfiguration = {
        type: "range",
        ranges: [
          { name: "0-100", from: 0, to: 100 },
          { name: "100-200", from: 100, to: 200 }
        ]
      };

      const result = transformFacetToAggs("price", facetConfig);

      expect(result).toEqual({
        filters: {
          filters: {
            "0-100": { range: { price: { gte: 0, lte: 100 } } },
            "100-200": { range: { price: { gte: 100, lte: 200 } } }
          }
        }
      });
    });

    it("should transform geo distance facet to geo_distance aggregation", () => {
      const facetConfig: FacetConfiguration = {
        type: "range",
        center: "0,0",
        unit: "km",
        ranges: [
          { name: "0-1km", from: 0, to: 1 },
          { name: "1-2km", from: 1, to: 2 }
        ]
      };

      const result = transformFacetToAggs("location", facetConfig);

      expect(result).toEqual({
        geo_distance: {
          field: "location",
          origin: "0,0",
          unit: "km",
          keyed: true,
          ranges: [
            { key: "0-1km", to: 1 },
            { key: "1-2km", from: 1, to: 2 }
          ]
        }
      });
    });

    it("should transform value facet with parameters", () => {
      const facetConfig: FacetConfiguration = {
        type: "value",
        sort: "value",
        direction: "desc",
        size: 30,
        include: "electronics.*",
        exclude: "books.*"
      };

      const result = transformFacetToAggs("category", facetConfig);

      expect(result).toEqual({
        terms: {
          field: "category",
          size: 30,
          order: { _key: "desc" },
          include: "electronics.*",
          exclude: "books.*"
        }
      });
    });

    it("should transform value facet with count sort and direction asc", () => {
      const consoleSpy = jest.spyOn(console, "warn").mockImplementation();

      const facetConfig: FacetConfiguration = {
        type: "value",
        sort: "count",
        direction: "asc"
      };

      const result = transformFacetToAggs("category", facetConfig);

      expect(result).toEqual({
        terms: {
          field: "category",
          size: 20,
          order: { _count: "asc" }
        }
      });

      consoleSpy.mockRestore();
    });
  });
});
