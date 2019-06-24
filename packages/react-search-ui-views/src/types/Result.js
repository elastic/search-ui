import PropTypes from "prop-types";

import FieldValueWrapper from "./FieldValueWrapper";

// Typically an object where keys are the field names, and values are field values.
// Also could be literally any other arbitrary value depending on the particular Search API response.
// Default views in Search UI know what to do with FieldValueWrapper values, but not arbitrary values, so it
// is usually better to work with FieldValueWrapper values. We encourage FieldValueWrapper, but we accept
// anything because we don't want users to have type error warnings unnecessarily.
//
// An example would be if a user requests "grouping" in an App Search API request. That will come back
// as "_group: {..}". It *should* be there in the Result so that a developer has it available to work
// with.
export default PropTypes.objectOf(
  PropTypes.oneOfType([PropTypes.any, FieldValueWrapper])
);
