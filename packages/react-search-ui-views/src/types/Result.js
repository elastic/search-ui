import PropTypes from "prop-types";

import FieldValueWrapper from "./FieldValueWrapper";

// An object where keys are the field names, and values are the values
// corresponding to that
export default PropTypes.objectOf(FieldValueWrapper);
