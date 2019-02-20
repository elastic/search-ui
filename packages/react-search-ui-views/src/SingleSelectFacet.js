import PropTypes from "prop-types";
import React from "react";
import Select, { components } from "react-select";

import { FacetValue, FilterValue } from "./types";

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

function serializeValue(value) {
  return JSON.stringify(value);
}

function deserializeValue(value) {
  return JSON.parse(value);
}

function toSelectOption(filterValue) {
  return {
    value: serializeValue(filterValue.value),
    label: filterValue.label,
    count: filterValue.count
  };
}

const setDefaultStyle = {
  option: () => ({}),
  control: () => ({}),
  dropdownIndicator: () => ({}),
  indicatorSeparator: () => ({})
};

function SingleSelectFacet({ label, onChange, options, values }) {
  const selectedFilterValue = values[0];

  const selectOptions = options.map(toSelectOption);
  const value = serializeValue(selectedFilterValue);
  const selectedOption = selectOptions.find(o => o.value === value);

  return (
    <div className="sui-search-facet sui-facet">
      <div className="sui-search-facet__label">{label}</div>
      <Select
        className="sui-select"
        classNamePrefix="sui-select"
        components={{ Option }}
        value={selectedOption}
        onChange={o => onChange(deserializeValue(o.value))}
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
  values: PropTypes.arrayOf(FilterValue).isRequired
};

export default SingleSelectFacet;
