import PropTypes from "prop-types";

export default PropTypes.shape({
  count: PropTypes.number.isRequired,
  from: PropTypes.number,
  to: PropTypes.number,
  name: PropTypes.string
});
