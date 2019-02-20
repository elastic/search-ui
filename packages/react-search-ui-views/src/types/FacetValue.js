import PropTypes from "prop-types";
import FilterValue from "./FilterValue";

export default PropTypes.shape({
  label: PropTypes.string.isRequired,
  count: PropTypes.number.isRequired,
  value: FilterValue.isRequired
});
