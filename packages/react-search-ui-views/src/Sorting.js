import PropTypes from "prop-types";
import React from "react";
import RRS from "react-responsive-select";
import { DownChevron } from ".";

import { appendClassName } from "./view-helpers";

function Sorting({ className, label, onChange, options, value, ...rest }) {
  const selectedValue = value;

  const selectedOption = selectedValue
    ? options.find(option => option.value === selectedValue)
    : null;

  return (
    <div className={appendClassName("sui-sorting", className)} {...rest}>
      {label && <div className="sui-sorting__label">{label}</div>}
      <RRS
        name="select"
        key={`sorting_select_${selectedOption}`}
        options={options}
        onChange={o => onChange(o.value)}
        caretIcon={<DownChevron key={`sorting_caret_${selectedOption}`} />}
        selectedValue={selectedOption && selectedOption.value}
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
