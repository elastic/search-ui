import PropTypes from "prop-types";
import FieldValue from "./FieldValue";

export default PropTypes.shape({
  from: FieldValue,
  name: PropTypes.string.isRequired,
  to: FieldValue
});
