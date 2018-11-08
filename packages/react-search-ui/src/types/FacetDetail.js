import PropTypes from "prop-types";
import RangeFacetOption from "./RangeFacetOption";
import ValueFacetOption from "./ValueFacetOption";

export default PropTypes.arrayOf(
  PropTypes.shape({
    data: PropTypes.arrayOf(
      PropTypes.oneOfType([ValueFacetOption, RangeFacetOption])
    ),
    type: PropTypes.string.isRequired
  })
);
