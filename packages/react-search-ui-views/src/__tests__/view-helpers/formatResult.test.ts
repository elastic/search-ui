import { formatResult } from "../../view-helpers";

describe("formatResult", () => {
  it("formats strings correctly", () => {
    expect(
      formatResult({
        stringField: { raw: "stringValue" }
      })
    ).toEqual({
      stringField: "stringValue"
    });
  });

  it("formats numbers correctly", () => {
    expect(
      formatResult({
        numberField: { raw: 5 }
      })
    ).toEqual({
      numberField: "5"
    });
  });

  it("formats dates correctly", () => {
    expect(
      formatResult({
        dateField: { raw: "1919-11-19T06:00:00+00:00" }
      })
    ).toEqual({
      dateField: "1919-11-19T06:00:00+00:00"
    });
  });

  it("formats string locations correctly", () => {
    expect(
      formatResult({
        locationStringField: { raw: "41.12,-71.34" }
      })
    ).toEqual({
      locationStringField: "41.12,-71.34"
    });
  });

  it("formats array locations correctly", () => {
    expect(
      formatResult({
        locationArrayField: { raw: [-71.34, 41.12] }
      })
    ).toEqual({
      locationArrayField: "-71.34,41.12"
    });
  });

  it("filters out arbitrary values", () => {
    expect(
      formatResult({
        stringField: { raw: "stringValue" },
        arbitraryField: "9000"
      })
    ).toEqual({
      stringField: "stringValue"
    });
  });

  it("filters out _meta field", () => {
    expect(
      formatResult({
        stringField: { raw: "stringValue" },
        _meta: {
          id: "123",
          engine: "national-parks",
          score: 1
        }
      })
    ).toEqual({
      stringField: "stringValue"
    });
  });

  it("html escapes raw values", () => {
    expect(
      formatResult({
        stringField: { raw: `& " ' < >` }
      })
    ).toEqual({
      stringField: `&amp; &quot; &#39; &lt; &gt;`
    });

    expect(
      formatResult({
        nestedField: {
          one: {
            two: {
              three: { raw: `<em>three - "quotes" - 'quotes'</em>` }
            }
          }
        }
      })
    ).toEqual({
      nestedField:
        '{"one":{"two":{"three":"&lt;em&gt;three - &quot;quotes&quot; - &#39;quotes&#39;&lt;/em&gt;"}}}'
    });

    expect(
      formatResult({
        nestedField: {
          one: {
            two: {
              three: { raw: [`three`, `<em>"quotes" - 'quotes'</em>`] }
            }
          }
        }
      })
    ).toEqual({
      nestedField:
        '{"one":{"two":{"three":"three,&lt;em&gt;&quot;quotes&quot; - &#39;quotes&#39;&lt;/em&gt;"}}}'
    });
  });

  it("doesnt html escape snippet values", () => {
    expect(
      formatResult({
        stringField: { snippet: `<em>highlighted text: " ' &</em>` }
      })
    ).toEqual({
      stringField: `<em>highlighted text: " ' &</em>`
    });
  });

  it("formats arrays correctly", () => {
    expect(
      formatResult({
        arrayField: { raw: ["one", "two", "three"] }
      })
    ).toEqual({
      arrayField: "one,two,three"
    });
  });

  it("formats nested fields correctly", () => {
    expect(formatResult({ one: { two: { raw: "two" } } })).toEqual({
      one: '{"two":"two"}'
    });
    expect(formatResult({ one: { two: { three: { raw: "three" } } } })).toEqual(
      {
        one: '{"two":{"three":"three"}}'
      }
    );
    expect(
      formatResult({
        one: { two: { three: { raw: ["three", "four"] } } }
      })
    ).toEqual({ one: '{"two":{"three":"three,four"}}' });
    expect(
      formatResult({
        one: [{ two: { raw: "two" } }, { three: { raw: "three" } }]
      })
    ).toEqual({
      one: '[{"two":"two"},{"three":"three"}]'
    });
  });
});
