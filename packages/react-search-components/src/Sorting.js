import PropTypes from "prop-types";
import React from "react";

function Sorting({ onChange, options, value }) {
  return (
    <div className="sorting">
      <select id="sorting" name="sorting" value={value} onChange={onChange}>
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.name}
          </option>
        ))}
      </select>
    </div>
  );
}

Sorting.propTypes = {
  onChange: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({ name: PropTypes.string, value: PropTypes.string })
  ).isRequired,
  value: PropTypes.string
};

export default Sorting;
