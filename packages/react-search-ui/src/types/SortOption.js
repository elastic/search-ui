import PropTypes from "prop-types";
import SortList from "./SortList";

const DIRECTIONS = ["asc", "desc", ""];
const SortOption = PropTypes.shape({
  // A display name, like "Name"
  name: PropTypes.string,
  // A field name, like "name" or an array of type sortList.
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(SortList)]),
  // asc or desc
  direction: PropTypes.oneOf(["asc", "desc", ""])
});

SortOption.create = function({ name, value, direction }) {
  if (!DIRECTIONS.includes(direction)) {
    direction = "";
  }

  return {
    name,
    value,
    direction
  };
};

export default SortOption;
