import PropTypes from "prop-types";
import FieldValue from "./FieldValue";

export default PropTypes.shape({
  // Beginning of the range, like 1
  from: FieldValue,
  // A unique name for this range, used for display
  name: PropTypes.string.isRequired,
  // End of the range, like 100
  to: FieldValue
});
