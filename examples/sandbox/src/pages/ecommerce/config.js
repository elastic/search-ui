import AppSearchAPIConnector from "@elastic/search-ui-app-search-connector";

const connector = new AppSearchAPIConnector({
  searchKey:
    process.env.REACT_APP_SEARCH_KEY || "search-nyxkw1fuqex9qjhfvatbqfmw",
  engineName: process.env.REACT_APP_SEARCH_ENGINE_NAME || "best-buy",
  endpointBase:
    process.env.REACT_APP_SEARCH_ENDPOINT_BASE ||
    "https://search-ui-sandbox.ent.us-central1.gcp.cloud.es.io",
  beforeSearchCall: (existingSearchOptions, next) =>
    next({
      ...existingSearchOptions,
      // For the purpose of the demo, we're only using grouping on the "/categories/TVs" page
      ...(window.location.pathname.match(/TVs/) && {
        group: { field: "product_group", collapse: true }
      })
    })
});

export const config = {
  alwaysSearchOnInitialLoad: true,
  searchQuery: {
    result_fields: {
      name: {
        raw: {},
        snippet: {
          size: 100,
          fallback: true
        }
      },
      image: { raw: {} },
      price: { raw: {} },
      child_category: { raw: {} },
      manufacturer: { raw: {} },
      department: { raw: {} },
      categories: { raw: {} },
      description: {
        raw: {},
        snippet: {
          size: 1000,
          fallback: true
        }
      },
      url: { raw: {} },
      rating: { raw: {} },
      shipping: { raw: {} },
      votes: { raw: {} },
      model: { raw: {} },
      // TV-specific fields
      tv_size: { raw: {} },
      tv_smart_tv: { raw: {} },
      tv_resolution: { raw: {} },
      product_group: { raw: {} }
    },
    facets: {
      categories: {
        type: "value",
        size: 250
      },
      manufacturer: {
        type: "value",
        size: 250
      },
      discount: { type: "value" },
      rating: {
        type: "range",
        ranges: [
          { from: 1, name: "★☆☆☆☆ & Up" },
          { from: 2, name: "★★☆☆☆ & Up" },
          { from: 3, name: "★★★☆☆ & Up" },
          { from: 4, name: "★★★★☆ & Up" },
          { from: 5, name: "★★★★★" }
        ]
      },
      price: {
        type: "range",
        ranges: [
          { from: 0, to: 25, name: "Under $25" },
          { from: 25, to: 50, name: "$25 to $50" },
          { from: 50, to: 100, name: "$50 to $100" },
          { from: 100, to: 200, name: "$100 to $200" },
          { from: 200, name: "$200 & Above" }
        ]
      },
      shipping: {
        type: "range",
        ranges: [{ to: 0.01, name: "Free shipping" }]
      },
      // TV-specific facets
      tv_size: {
        type: "value",
        sort: { value: "asc" },
        size: 250
      },
      tv_smart_tv: {
        type: "value"
      },
      tv_resolution: {
        type: "value",
        sort: { value: "asc" }
      }
    },
    disjunctiveFacets: [
      "categories",
      "manufacturer",
      "price",
      "tv_size",
      "tv_resolution"
    ]
  },
  autocompleteQuery: {
    results: {
      resultsPerPage: 5,
      result_fields: {
        name: {
          snippet: {
            size: 100,
            fallback: true
          }
        },
        url: {
          raw: {}
        }
      }
    },
    suggestions: {
      types: {
        documents: {
          fields: ["name", "description"]
        }
      },
      size: 5
    }
  },
  apiConnector: connector
};

export const SORT_OPTIONS = [
  {
    name: "Relevance",
    value: []
  },
  {
    name: "Price: Low to High",
    value: [
      {
        field: "price",
        direction: "asc"
      }
    ]
  },
  {
    name: "Price: High to Low",
    value: [
      {
        field: "price",
        direction: "desc"
      }
    ]
  },
  {
    name: "Rating",
    value: [
      {
        field: "rating",
        direction: "desc"
      }
    ]
  }
];
