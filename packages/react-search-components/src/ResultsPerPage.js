import PropTypes from "prop-types";
import React from "react";
import Select from "react-select";

const setDefaultStyle = {
  option: () => ({}),
  control: () => ({}),
  dropdownIndicator: () => ({}),
  indicatorSeparator: () => ({})
};

function ResultsPerPage({ onChange, options, value }) {
  const selectedValue = value;

  const selectedOption = selectedValue
    ? options.find(option => option === selectedValue)
    : null;

  return (
    <div className="sui-results-per-page">
      <div className="sui-results-per-page__label">Show</div>
      <Select
        className="sui-select sui-select--inline"
        classNamePrefix="sui-select"
        value={selectedOption}
        onChange={o => onChange(o)}
        options={options}
        isSearchable={false}
        styles={setDefaultStyle}
      />
    </div>
  );
}

ResultsPerPage.propTypes = {
  onChange: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(PropTypes.number).isRequired,
  value: PropTypes.number
};

export default ResultsPerPage;
