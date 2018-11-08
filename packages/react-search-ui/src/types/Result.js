import PropTypes from "prop-types";

export default PropTypes.shape({
  data: PropTypes.object.isRequired,
  getRaw: PropTypes.func.isRequired,
  getSnippet: PropTypes.func.isRequired
});
