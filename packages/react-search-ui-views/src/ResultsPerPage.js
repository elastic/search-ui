import PropTypes from "prop-types";
import React from "react";
import Select from "react-select";

import { appendClassName } from "./view-helpers";

const setDefaultStyle = {
  option: () => ({}),
  control: () => ({}),
  dropdownIndicator: () => ({}),
  indicatorSeparator: () => ({}),
  singleValue: provided => {
    // Pulling out CSS that we don't want
    // eslint-disable-next-line no-unused-vars
    const { position, top, transform, maxWidth, ...rest } = provided;
    return { ...rest, lineHeight: 1, marginRight: 0 };
  },
  valueContainer: provided => ({ ...provided, paddingRight: 0 })
};

const wrapOption = option => ({ label: option, value: option });

function ResultsPerPage({
  className,
  onChange,
  options,
  value: selectedValue
}) {
  let selectedOption = null;

  if (selectedValue) {
    selectedOption = wrapOption(selectedValue);

    if (!options.includes(selectedValue)) options = [selectedValue, ...options];
  }

  return (
    <div className={appendClassName("sui-results-per-page", className)}>
      <div className="sui-results-per-page__label">Show</div>
      <Select
        className="sui-select sui-select--inline"
        classNamePrefix="sui-select"
        value={selectedOption}
        onChange={o => onChange(o.value)}
        options={options.map(wrapOption)}
        isSearchable={false}
        styles={setDefaultStyle}
      />
    </div>
  );
}

ResultsPerPage.propTypes = {
  onChange: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(PropTypes.number).isRequired,
  className: PropTypes.string,
  value: PropTypes.number
};

export default ResultsPerPage;
