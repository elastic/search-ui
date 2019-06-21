import PropTypes from "prop-types";

import FieldValue from "./FieldValue";

export default PropTypes.shape({
  // A raw field value, like 'I am a raw result', or 2, or true. Raw values may
  // or may not be html escaped, so *always* sanitize a raw value before rendering
  // it on a page as html.
  raw: FieldValue,
  // A snippet value contains a highlighted value. I.e., 'I <em>am</em> a raw
  // result'. These are always sanitized and safe to render as html.
  snippet: PropTypes.string
});

export function isFieldValueWrapper(object) {
  return (
    object && (object.hasOwnProperty("raw") || object.hasOwnProperty("snippet"))
  );
}
