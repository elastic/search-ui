import PropTypes from "prop-types";
import React from "react";
import Select, { components } from "react-select";
import deepEqual from "deep-equal";

import { FacetValue, FilterValue } from "./types";
import { getFilterValueDisplay } from "./view-helpers";
import { appendClassName } from "./view-helpers";

function Option(props) {
  return (
    <components.Option {...props}>
      <span className="sui-select__option-label">{props.data.label}</span>
      <span className="sui-select__option-count">
        {props.data.count.toLocaleString("en")}
      </span>
    </components.Option>
  );
}

Option.propTypes = {
  data: PropTypes.object.isRequired
};

function toSelectOption(filterValue) {
  return {
    value: filterValue.value,
    label: getFilterValueDisplay(filterValue.value),
    count: filterValue.count
  };
}

const setDefaultStyle = {
  option: () => ({}),
  control: () => ({}),
  dropdownIndicator: () => ({}),
  indicatorSeparator: () => ({})
};

function SingleSelectFacet({ className, label, onChange, options, values }) {
  const selectOptions = options.map(toSelectOption);
  const selectedFilterValue = values[0];
  const selectedOption = selectOptions.find(option => {
    if (
      selectedFilterValue &&
      selectedFilterValue.name &&
      option.value.name === selectedFilterValue.name
    )
      return true;
    if (deepEqual(option.value, selectedFilterValue)) return true;
    return false;
  });

  return (
    <div className={appendClassName("sui-facet", className)}>
      <div className="sui-facet__title">{label}</div>
      <Select
        className="sui-select"
        classNamePrefix="sui-select"
        components={{ Option }}
        value={selectedOption}
        onChange={o => onChange(o.value)}
        options={selectOptions}
        isSearchable={false}
        styles={setDefaultStyle}
      />
    </div>
  );
}

SingleSelectFacet.propTypes = {
  label: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(FacetValue).isRequired,
  values: PropTypes.arrayOf(FilterValue).isRequired,
  className: PropTypes.string
};

export default SingleSelectFacet;
