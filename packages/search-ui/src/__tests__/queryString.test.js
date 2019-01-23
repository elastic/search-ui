import queryString from "../queryString";

const parsed = {
  integer: 1,
  float: 1.1,
  bigFloat: 0.6000000000000001,
  booleanTrue: true,
  booleanFalse: true,
  booleanString: "true",
  integerString: "1",
  object: {
    integer: 1,
    float: 1.1,
    bigFloat: 0.6000000000000001,
    booleanTrue: true,
    booleanFalse: true,
    booleanString: "true",
    integerString: "1"
  },
  array: [
    {
      nestedArray: [
        {
          integer: 1,
          float: 1.1
        }
      ]
    }
  ]
};

const stringified =
  "integer=n_1_n&float=n_1.1_n&bigFloat=n_0.6000000000000001_n&booleanTrue=b_true_b&booleanFalse=b_true_b&booleanString=true&integerString=1&object%5Binteger%5D=n_1_n&object%5Bfloat%5D=n_1.1_n&object%5BbigFloat%5D=n_0.6000000000000001_n&object%5BbooleanTrue%5D=b_true_b&object%5BbooleanFalse%5D=b_true_b&object%5BbooleanString%5D=true&object%5BintegerString%5D=1&array%5B0%5D%5BnestedArray%5D%5B0%5D%5Binteger%5D=n_1_n&array%5B0%5D%5BnestedArray%5D%5B0%5D%5Bfloat%5D=n_1.1_n";

const appSearchFiltersParsed = {
  filters: {
    all: [
      // Range with type Number
      {
        visitors: {
          from: 1,
          to: 100
        }
      },
      // Range with type Date
      {
        date_established: {
          from: "1900-01-01T12:00:00+00:00",
          to: "1950-01-01T00:00:00+00:00"
        }
      },
      // Geo with type Geolocation
      {
        location: {
          center: "37.386483, -122.083842",
          distance: 300,
          unit: "km"
        }
      },
      // Value with type Text
      { world_heritage_site: "true" },
      // Value with type Date
      { created_date: "1900-01-01T12:00:00+00:00" },
      // Value with Type Number
      { visitors: 100 },
      // Combining with "all"
      { category: "fun" },
      { category: "healthy" },
      // Nested "or"s
      { category: ["gradeA", "gradeB"] }
    ]
  }
};

const appSearchFiltersStringified =
  "filters%5Ball%5D%5B0%5D%5Bvisitors%5D%5Bfrom%5D=n_1_n&filters%5Ball%5D%5B0%5D%5Bvisitors%5D%5Bto%5D=n_100_n&filters%5Ball%5D%5B1%5D%5Bdate_established%5D%5Bfrom%5D=1900-01-01T12%3A00%3A00%2B00%3A00&filters%5Ball%5D%5B1%5D%5Bdate_established%5D%5Bto%5D=1950-01-01T00%3A00%3A00%2B00%3A00&filters%5Ball%5D%5B2%5D%5Blocation%5D%5Bcenter%5D=37.386483%2C%20-122.083842&filters%5Ball%5D%5B2%5D%5Blocation%5D%5Bdistance%5D=n_300_n&filters%5Ball%5D%5B2%5D%5Blocation%5D%5Bunit%5D=km&filters%5Ball%5D%5B3%5D%5Bworld_heritage_site%5D=true&filters%5Ball%5D%5B4%5D%5Bcreated_date%5D=1900-01-01T12%3A00%3A00%2B00%3A00&filters%5Ball%5D%5B5%5D%5Bvisitors%5D=n_100_n&filters%5Ball%5D%5B6%5D%5Bcategory%5D=fun&filters%5Ball%5D%5B7%5D%5Bcategory%5D=healthy&filters%5Ball%5D%5B8%5D%5Bcategory%5D%5B0%5D=gradeA&filters%5Ball%5D%5B8%5D%5Bcategory%5D%5B1%5D=gradeB";

describe("#parse", () => {
  function subject(value) {
    return queryString.parse(value);
  }

  it("will parse an object correctly", () => {
    expect(subject(stringified)).toEqual(parsed);
  });

  it("will parse an app search filters object correctly", () => {
    expect(subject(appSearchFiltersStringified)).toEqual(
      appSearchFiltersParsed
    );
  });
});

describe("#stringify", () => {
  function subject(value) {
    return queryString.stringify(value);
  }

  it("will stringify an object correctly", () => {
    expect(subject(parsed)).toEqual(stringified);
  });

  it("will stringify app search filters object correctly", () => {
    expect(subject(appSearchFiltersParsed)).toEqual(
      appSearchFiltersStringified
    );
  });
});
