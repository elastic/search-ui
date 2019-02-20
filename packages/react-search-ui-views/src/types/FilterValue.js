import PropTypes from "prop-types";
import ValueFilterValue from "./ValueFilterValue";
import RangeFilterValue from "./RangeFilterValue";

export default PropTypes.oneOfType([RangeFilterValue, ValueFilterValue]);
