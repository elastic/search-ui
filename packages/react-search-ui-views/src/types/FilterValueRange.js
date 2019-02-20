import PropTypes from "prop-types";
import Date from "./Date";
import Number from "./Number";

export default PropTypes.shape({
  from: PropTypes.oneOfType([Date, Number]),
  name: PropTypes.string.isRequired,
  to: PropTypes.oneOfType([Date, Number])
});
