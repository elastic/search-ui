import areShallowEqual from "../../helpers/areShallowEqual";

describe("when both objects are undefined", () => {
  it("should return true", () => {
    expect(areShallowEqual()).toBe(true);
  });
});

describe("when a is undefined", () => {
  it("should return an empty string", () => {
    expect(areShallowEqual(undefined, {})).toBe("");
  });
});

describe("when b is undefined", () => {
  it("should return an empty string", () => {
    expect(areShallowEqual({}, undefined)).toBe("");
  });
});

describe("when objects are empty", () => {
  it("should detect whether two objects have equal properties", () => {
    const a = {};
    const b = {};
    expect(areShallowEqual(a, b)).toBe(true);
  });
});

describe("when objects are not empty", () => {
  it("should detect whether two objects have equal properties", () => {
    const a = { a: "a", b: "b" };
    const b = { a: "a", b: "b" };
    expect(areShallowEqual(a, b)).toBe(true);
  });
});

describe("when  objects have different properties", () => {
  it("should detect whether two objects have equal properties", () => {
    const a = { a: "a" };
    const b = { a: "a", b: "b" };
    expect(areShallowEqual(a, b)).toBe("b");
  });

  it("should still detect whether two objects have equal properties when args are reversed", () => {
    const a = { a: "a" };
    const b = { a: "a", b: "b" };
    expect(areShallowEqual(b, a)).toBe("b");
  });
});

describe("when have nested object properties that are not shallow equal", () => {
  it("should detect whether two objects have equal properties", () => {
    const a = { a: { a1: "a" }, b: "b" };
    const b = { a: { a1: "a" }, b: "b" };
    expect(areShallowEqual(a, b)).toBe("a");
  });
});

describe("when have nested object properties that are shallow equal", () => {
  it("should detect whether two objects have equal properties", () => {
    const a1 = { a1: "a" };
    const a = { a: a1, b: "b" };
    const b = { a: a1, b: "b" };
    expect(areShallowEqual(a, b)).toBe(true);
  });
});

describe("when a list of keys is passed", () => {
  it("should detect whether two objects have equal properties based on keys list", () => {
    const keys = ["a"];
    const a = { a: "a" };
    const b = { a: "a", b: "b" };
    expect(areShallowEqual(b, a, keys)).toBe(true);
  });

  describe("when some keys are not in either object", () => {
    it("should detect whether two objects have equal properties based on keys list", () => {
      const keys = ["a", "b", "c", "d"];
      const a = { a: "a" };
      const b = { a: "a", e: "e" };
      expect(areShallowEqual(b, a, keys)).toBe(true);
    });
  });

  describe("when no keys are not in either object", () => {
    it("should detect whether two objects have equal properties based on keys list", () => {
      const keys = ["c", "d"];
      const a = { a: "a" };
      const b = { a: "a", b: "b" };
      expect(areShallowEqual(b, a, keys)).toBe(true);
    });
  });

  describe("when all keys are in both objects", () => {
    it("should detect whether two objects have equal properties based on keys list", () => {
      const keys = ["c", "d"];
      const a = { a: "a", b: "b" };
      const b = { a: "a", b: "b" };
      expect(areShallowEqual(b, a, keys)).toBe(true);
    });
  });

  describe("when properties are not equal", () => {
    it("should detect whether two objects have equal properties based on keys list", () => {
      const keys = ["a", "b"];
      const a = { a: "b", b: "b" };
      const b = { a: "a", b: "b" };
      expect(areShallowEqual(b, a, keys)).toBe("a");
    });
  });

  describe("when properties are missing", () => {
    it("should detect whether two objects have equal properties based on keys list", () => {
      const keys = ["a", "b"];
      const a = { a: "a", b: "b" };
      const b = { a: "a" };
      expect(areShallowEqual(b, a, keys)).toBe("b");
    });
  });
});
