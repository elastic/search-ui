import PropTypes from "prop-types";
import FacetType from "./FacetType";
import FacetValue from "./FacetValue";

export default PropTypes.shape({
  data: PropTypes.arrayOf(FacetValue).isRequired,
  // Name of the field this facet is associated with
  field: PropTypes.string.isRequired,
  type: FacetType.isRequired
});
