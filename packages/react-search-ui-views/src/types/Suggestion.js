import PropTypes from "prop-types";

export default PropTypes.shape({
  suggestion: PropTypes.string.isRequired,
  highlight: PropTypes.string,
  data: PropTypes.object
});
