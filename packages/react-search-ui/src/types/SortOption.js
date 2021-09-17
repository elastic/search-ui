import PropTypes from "prop-types";
import SortList from "./SortList";

const DIRECTIONS = ["asc", "desc", ""];
const SortOption = PropTypes.shape({
  // A display name, like "Name"
  name: PropTypes.string,
  // A field name, like "name" or a SortList
  value: PropTypes.oneOfType([PropTypes.string, SortList]),
  // asc or desc, only required if not passing SortList for value
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
