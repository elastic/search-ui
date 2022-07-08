function isFieldValueWrapper(object) {
  return (
    object &&
    (Object.prototype.hasOwnProperty.call(object, "raw") ||
      Object.prototype.hasOwnProperty.call(object, "snippet"))
  );
}

// Returns true for objects like this:
// objectField: {
//     objectSubField1: { raw: "one" },
//     objectSubField2: { raw: "two" }
// }
// And false for objects like this:
// objectField: { raw: "one" }
function isNestedField(result, field) {
  return (
    result &&
    result[field] &&
    field !== "_meta" &&
    typeof result[field] === "object" &&
    !isFieldValueWrapper(result[field])
  );
}

// Takes any value and removes the wrapper around deepest values
// (removes the wrapper Object with "raw" and/or "snippet" fields)
// See tests for examples
function cleanValueWrappers(value) {
  if (isFieldValueWrapper(value)) {
    return getEscapedField(value);
  }

  if (Array.isArray(value)) {
    return value.map(cleanValueWrappers);
  }

  if (typeof value === "object") {
    return Object.entries(value).reduce((acc, [key, value]) => {
      acc[key] = cleanValueWrappers(value);
      return acc;
    }, {});
  }

  return value;
}

function getFieldType(object, type) {
  if (object) return object[type];
}

export function getRaw(object) {
  return getFieldType(object, "raw");
}

function getSnippet(object) {
  return getFieldType(object, "snippet");
}

function htmlEscape(str) {
  if (!str) return "";

  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export function getEscapedField(maybeObject) {
  // Fallback to raw values here, because non-string fields
  // will not have a snippet fallback. Raw values MUST be html escaped.
  const safeField = getSnippet(maybeObject) || htmlEscape(getRaw(maybeObject));
  return Array.isArray(safeField) ? safeField.join(", ") : safeField;
}

export function formatResult(result) {
  return Object.keys(result).reduce((acc, field) => {
    if (isNestedField(result, field)) {
      return {
        ...acc,
        [field]: JSON.stringify(cleanValueWrappers(result[field]))
      };
    }

    // If we receive an arbitrary value from the response, we may not properly
    // handle it, so we should filter out arbitrary values here.
    //
    // I.e.,
    // Arbitrary value: "_metaField: '1939191'"
    // vs.
    // FieldValueWrapper: "_metaField: {raw: '1939191'}"
    if (!isFieldValueWrapper(result[field])) return acc;

    return { ...acc, [field]: getEscapedField(result[field]) };
  }, {});
}
