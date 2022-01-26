import queryString from "../queryString";

const parsed = {
  integer: 1,
  integer0: 0,
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

const parsedWithLargeArray = {
  largeArray: [
    1,
    2,
    3,
    4,
    5,
    6,
    7,
    8,
    9,
    10,
    11,
    12,
    13,
    14,
    15,
    16,
    17,
    18,
    19,
    20,
    21,
    22,
    23,
    24,
    25
  ]
};

const stringified =
  "integer=n_1_n&integer0=n_0_n&float=n_1.1_n&bigFloat=n_0.6000000000000001_n&booleanTrue=b_true_b&booleanFalse=b_true_b&booleanString=true&integerString=1&object%5Binteger%5D=n_1_n&object%5Bfloat%5D=n_1.1_n&object%5BbigFloat%5D=n_0.6000000000000001_n&object%5BbooleanTrue%5D=b_true_b&object%5BbooleanFalse%5D=b_true_b&object%5BbooleanString%5D=true&object%5BintegerString%5D=1&array%5B0%5D%5BnestedArray%5D%5B0%5D%5Binteger%5D=n_1_n&array%5B0%5D%5BnestedArray%5D%5B0%5D%5Bfloat%5D=n_1.1_n";

const stringifiedWithLargeArray =
  "largeArray%5B0%5D=n_1_n&largeArray%5B1%5D=n_2_n&largeArray%5B2%5D=n_3_n&largeArray%5B3%5D=n_4_n&largeArray%5B4%5D=n_5_n&largeArray%5B5%5D=n_6_n&largeArray%5B6%5D=n_7_n&largeArray%5B7%5D=n_8_n&largeArray%5B8%5D=n_9_n&largeArray%5B9%5D=n_10_n&largeArray%5B10%5D=n_11_n&largeArray%5B11%5D=n_12_n&largeArray%5B12%5D=n_13_n&largeArray%5B13%5D=n_14_n&largeArray%5B14%5D=n_15_n&largeArray%5B15%5D=n_16_n&largeArray%5B16%5D=n_17_n&largeArray%5B17%5D=n_18_n&largeArray%5B18%5D=n_19_n&largeArray%5B19%5D=n_20_n&largeArray%5B20%5D=n_21_n&largeArray%5B21%5D=n_22_n&largeArray%5B22%5D=n_23_n&largeArray%5B23%5D=n_24_n&largeArray%5B24%5D=n_25_n";

describe("#parse", () => {
  function subject(value) {
    return queryString.parse(value);
  }

  it("will parse an object correctly", () => {
    expect(subject(stringified)).toEqual(parsed);
  });

  it("will parse large arrays correctly", () => {
    expect(subject(stringifiedWithLargeArray)).toEqual(parsedWithLargeArray);
  });
});

describe("#stringify", () => {
  function subject(value) {
    return queryString.stringify(value);
  }

  it("will stringify an object correctly", () => {
    expect(subject(parsed)).toEqual(stringified);
  });
});
