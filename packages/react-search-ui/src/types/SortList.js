import PropTypes from "prop-types";

export default PropTypes.objectOf(PropTypes.string, PropTypes.string); // [{fieldName1: sortDirection1}, {fieldName2: sortDirection2}]
