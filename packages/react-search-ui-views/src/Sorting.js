import PropTypes from "prop-types";
import React from "react";
import Select from "react-select";

import { appendClassName } from "./view-helpers";

const setDefaultStyle = {
  option: () => ({}),
  control: () => ({}),
  dropdownIndicator: () => ({}),
  indicatorSeparator: () => ({})
};

function Sorting({ className, label, onChange, options, value }) {
  const selectedValue = value;

  const selectedOption = selectedValue
    ? options.find(option => option.value === selectedValue)
    : null;

  return (
    <div className={appendClassName("sui-sorting", className)}>
      {label && <div className="sui-sorting__label">{label}</div>}
      <Select
        className="sui-select"
        classNamePrefix="sui-select"
        value={selectedOption}
        onChange={o => onChange(o.value)}
        options={options}
        isSearchable={false}
        styles={setDefaultStyle}
      />
    </div>
  );
}

Sorting.propTypes = {
  className: PropTypes.string,
  label: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({ value: PropTypes.string, label: PropTypes.string })
  ).isRequired,
  value: PropTypes.string
};

export default Sorting;
