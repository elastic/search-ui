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
function isObjectField(result, field) {
  return (
    result &&
    result[field] &&
    typeof result[field] === "object" &&
    !isFieldValueWrapper(result[field])
  );
}

// Flattens object field like this:
// objectField: {
//     objectSubField1: { raw: "one" },
//     objectSubField2: { raw: "two" }
// }
// =>
// {
//     "objectField.objectSubField1": "one",
//     "objectField.objectSubField2": "two"
// }
function flattenObjectField(result, field) {
  const object = result[field];
  const flattenedObject = {};
  Object.keys(object).forEach((key) => {
    flattenedObject[`${field}.${key}`] = getSnippetOrRaw(object[key]);
  });
  return flattenedObject;
}

function getFieldType(result, field, type) {
  if (result[field]) return result[field][type];
}

export function getRaw(result, field) {
  return getFieldType(result, field, "raw");
}

function getSnippet(result, field) {
  return getFieldType(result, field, "snippet");
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

function getSnippetOrRaw(maybeObject) {
  return maybeObject.snippet || htmlEscape(maybeObject.raw) || maybeObject;
}

export function getEscapedField(result, field) {
  // Fallback to raw values here, because non-string fields
  // will not have a snippet fallback. Raw values MUST be html escaped.
  const safeField =
    getSnippet(result, field) || htmlEscape(getRaw(result, field));
  return Array.isArray(safeField) ? safeField.join(", ") : safeField;
}

export function getEscapedFields(result) {
  return Object.keys(result).reduce((acc, field) => {
    if (isObjectField(result, field)) {
      return { ...acc, ...flattenObjectField(result, field) };
    }

    // If we receive an arbitrary value from the response, we may not properly
    // handle it, so we should filter out arbitrary values here.
    //
    // I.e.,
    // Arbitrary value: "_metaField: '1939191'"
    // vs.
    // FieldValueWrapper: "_metaField: {raw: '1939191'}"
    if (!isFieldValueWrapper(result[field])) return acc;

    return { ...acc, [field]: getEscapedField(result, field) };
  }, {});
}

export function formatResult(result) {
  return getEscapedFields(result);
}
