import PropTypes from "prop-types";
import FilterValue from "./FilterValue";

export default PropTypes.shape({
  // Number of results for this filter
  count: PropTypes.number.isRequired,
  // Filter to apply if selected
  value: FilterValue.isRequired
});
