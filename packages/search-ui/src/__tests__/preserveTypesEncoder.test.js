import preserveTypesEncoder from "../preserveTypesEncoder";

describe("#decode", () => {
  function subject(value) {
    return preserveTypesEncoder.decode(
      value,
      () => "value from default decoder"
    );
  }

  it("Will unpad an Integer value", () => {
    const value = "n_1_n";
    expect(subject(value)).toEqual(1);
  });

  it("Will unpad a float value", () => {
    const value = "n_1.1_n";
    expect(subject(value)).toEqual(1.1);
  });

  it("Will unpad a more difficult float value", () => {
    const value = "n_0.6000000000000001_n";
    expect(subject(value)).toEqual(0.6000000000000001);
  });

  it("Will unpad a true boolean value", () => {
    const value = "b_true_b";
    expect(subject(value)).toEqual(true);
  });

  it("Will unpad a false boolean value", () => {
    const value = "b_false_b";
    expect(subject(value)).toEqual(false);
  });

  it("Will defer to default decoder for String values that match inner, but not exactly", () => {
    const value = "mob_true_bad";
    expect(subject(value)).toEqual("value from default decoder");
  });

  it("Will defer to default decoder for String values that match beginning, but not exactly on end", () => {
    const value = "b_true_bad";
    expect(subject(value)).toEqual("value from default decoder");
  });

  it("Will defer to default decoder for String values that match end, but not exactly on beginning", () => {
    const value = "mob_true_b";
    expect(subject(value)).toEqual("value from default decoder");
  });

  it("Will defer to default decoder for String values that look like booleans", () => {
    const value = "true";
    expect(subject(value)).toEqual("value from default decoder");
  });

  it("Will defer to default decoder for String values", () => {
    const value = "1";
    expect(subject(value)).toEqual("value from default decoder");
  });
});

describe("#encode", () => {
  function subject(value) {
    return preserveTypesEncoder.encode(
      value,
      () => "value from default encoder"
    );
  }

  it("Will pad an Integer value", () => {
    const value = 1;
    expect(subject(value)).toEqual("n_1_n");
  });

  it("Will pad a float value", () => {
    const value = 1.1;
    expect(subject(value)).toEqual("n_1.1_n");
  });

  it("Will pad a more difficult float value", () => {
    const value = 0.6000000000000001;
    expect(subject(value)).toEqual("n_0.6000000000000001_n");
  });

  it("Will pad a boolean value", () => {
    const value = true;
    expect(subject(value)).toEqual("b_true_b");
  });

  it("Will defer to default encoder for String values that look like booleans", () => {
    const value = "true";
    expect(subject(value)).toEqual("value from default encoder");
  });

  it("Will defer to default encoder for String values", () => {
    const value = "1";
    expect(subject(value)).toEqual("value from default encoder");
  });
});
