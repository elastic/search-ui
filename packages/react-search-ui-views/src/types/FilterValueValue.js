import PropTypes from "prop-types";
import Date from "./Date";
import Number from "./Number";
import Text from "./Text";

export default PropTypes.oneOfType([Date, Number, Text]);
