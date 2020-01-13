import PropTypes from "prop-types";

import FieldValueWrapper from "./FieldValueWrapper";

// If field is a "FieldValueWrapper", it can be displayed by the UI.
//
// If it is any other object ("PropTypes.any"), it will be passed along with
// the object but will be ignored by the UI.
export default PropTypes.objectOf(
  PropTypes.oneOfType([PropTypes.any, FieldValueWrapper])
);
