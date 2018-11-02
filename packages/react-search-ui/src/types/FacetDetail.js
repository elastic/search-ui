import PropTypes from "prop-types";

const ValueFacet = PropTypes.shape({
  count: PropTypes.number.isRequired,
  value: PropTypes.string.isRequired
});

const RangeFacet = PropTypes.shape({
  from: PropTypes.number,
  to: PropTypes.number,
  count: PropTypes.number.isRequired,
  name: PropTypes.string
});

export default PropTypes.arrayOf(
  PropTypes.shape({
    data: PropTypes.arrayOf(PropTypes.oneOfType([ValueFacet, RangeFacet])),
    type: PropTypes.string.isRequired
  })
);
