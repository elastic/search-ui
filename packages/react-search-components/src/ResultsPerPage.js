import PropTypes from "prop-types";
import React from "react";

function ResultsPerPage({ onChange, options, value }) {
  return (
    <div className="sui-results-per-page">
      <label htmlFor="sui-results-per-page__label">
        Show{" "}
        <select
          name="results-per-page"
          id="sui-results-per-page__select"
          value={value}
          onChange={onChange}
        >
          {options.map(option => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}

ResultsPerPage.propTypes = {
  onChange: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(PropTypes.number).isRequired,
  value: PropTypes.number
};

export default ResultsPerPage;
