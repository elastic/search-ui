import PropTypes from "prop-types";

/*
  [TODO Next Major]

  This file exists alongside Result.js to enforce that Result objects have an
  ID in certain views that already require it.

  I wanted to add id directly to Result.js, but that would be a breaking change. This exists
  to give better validation warnings to those files that already implicitly required it.
*/
export default PropTypes.objectOf(
  PropTypes.shape({
    id: PropTypes.shape({
      raw: PropTypes.string
    }).isRequired
  }).isRequired
);
