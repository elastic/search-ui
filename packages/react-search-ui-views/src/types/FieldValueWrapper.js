import PropTypes from "prop-types";

import FieldValue from "./FieldValue";

export default PropTypes.shape({
  // A raw field value, like 'I am a raw result', or 2, or true
  raw: FieldValue,
  // A snippet value contains a highlighted value. I.e., 'I <em>am</em> a raw
  // result'
  snippet: PropTypes.string
});

export function isFieldValueWrapper(object) {
  return (
    object && (object.hasOwnProperty("raw") || object.hasOwnProperty("snippet"))
  );
}
