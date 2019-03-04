import PropTypes from "prop-types";
import FilterType from "./FilterType";
import FilterValue from "./FilterValue";

export default PropTypes.shape({
  field: PropTypes.string.isRequired,
  values: PropTypes.arrayOf(FilterValue).isRequired,
  type: FilterType.isRequired
});
