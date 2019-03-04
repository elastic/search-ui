import PropTypes from "prop-types";
import FilterValueValue from "./FilterValueValue";
import FilterValueRange from "./FilterValueRange";

export default PropTypes.oneOfType([FilterValueRange, FilterValueValue]);
