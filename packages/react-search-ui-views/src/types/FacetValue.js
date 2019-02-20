import PropTypes from "prop-types";
import FilterValue from "./FilterValue";

export default PropTypes.shape({
  count: PropTypes.number.isRequired,
  value: FilterValue.isRequired
});
