import PropTypes from "prop-types";

export default PropTypes.arrayOf(
  PropTypes.shape({
    field: PropTypes.string,
    direction: PropTypes.oneOf(["asc", "desc"])
  })
);
