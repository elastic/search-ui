import PropTypes from "prop-types";

const DIRECTIONS = ["asc", "desc", ""];
const SortOption = PropTypes.shape({
  // A display name, like "Name"
  name: PropTypes.string,
  // A field name, like "name".
  value: PropTypes.string,
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
