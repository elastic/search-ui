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

const stringified =
  "integer=n_1_n&integer0=n_0_n&float=n_1.1_n&bigFloat=n_0.6000000000000001_n&booleanTrue=b_true_b&booleanFalse=b_true_b&booleanString=true&integerString=1&object%5Binteger%5D=n_1_n&object%5Bfloat%5D=n_1.1_n&object%5BbigFloat%5D=n_0.6000000000000001_n&object%5BbooleanTrue%5D=b_true_b&object%5BbooleanFalse%5D=b_true_b&object%5BbooleanString%5D=true&object%5BintegerString%5D=1&array%5B0%5D%5BnestedArray%5D%5B0%5D%5Binteger%5D=n_1_n&array%5B0%5D%5BnestedArray%5D%5B0%5D%5Bfloat%5D=n_1.1_n";

describe("#parse", () => {
  function subject(value) {
    return queryString.parse(value);
  }

  it("will parse an object correctly", () => {
    expect(subject(stringified)).toEqual(parsed);
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
