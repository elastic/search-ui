import PropTypes from "prop-types";
import FacetType from "./FacetType";
import FacetValue from "./FacetValue";

export default PropTypes.shape({
  data: PropTypes.arrayOf(FacetValue).isRequired,
  field: PropTypes.string.isRequired,
  type: FacetType.isRequired
});
