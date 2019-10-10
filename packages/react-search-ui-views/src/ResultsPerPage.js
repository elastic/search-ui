import PropTypes from "prop-types";
import React from "react";
import RRS from "react-responsive-select";
import { DownChevron } from ".";

import { appendClassName } from "./view-helpers";

const wrapOption = option => ({ text: option, value: option });

function ResultsPerPage({
  className,
  onChange,
  options,
  value: selectedValue,
  ...rest
}) {
  let selectedOption = null;

  if (selectedValue) {
    selectedOption = wrapOption(selectedValue);

    if (!options.includes(selectedValue)) options = [selectedValue, ...options];
  }

  return (
    <div
      className={appendClassName("sui-results-per-page", className)}
      {...rest}
    >
      <div className="sui-results-per-page__label">Show</div>
      {/* <Select
        className="sui-select sui-select--inline"
        classNamePrefix="sui-select"
        value={selectedOption}
        onChange={o => onChange(o.value)}
        options={options.map(wrapOption)}
        isSearchable={false}
        styles={setDefaultStyle}
      /> */}
      <RRS
        name="select"
        options={options.map(wrapOption)}
        onChange={o => onChange(o.value)}
        caretIcon={<DownChevron />}
        selectedValue={selectedOption.value}
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
