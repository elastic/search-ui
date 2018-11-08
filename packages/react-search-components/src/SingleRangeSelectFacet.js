import PropTypes from "prop-types";
import React from "react";
import Select, { components } from "react-select";

import { RangeFacetOption, RangeFilterValue } from "./types";

function Option(props) {
  return (
    <components.Option {...props}>
      <span className="eco-search-select__option-label">
        {props.data.label}
      </span>
      <span className="eco-search-select__option-count">
        {props.data.count.toLocaleString("en")}
      </span>
    </components.Option>
  );
}

function toValue(from, to) {
  return `${from || ""}_${to || ""}`;
}

function toSelectOption(filterValue) {
  return {
    value: toValue(filterValue.from, filterValue.to),
    label: filterValue.name,
    count: filterValue.count
  };
}

function toFilterValue(selectOption) {
  const [from, to] = selectOption.value.split("_");

  return {
    ...(from && { from: Number(from) }),
    ...(to && { to: Number(to) })
  };
}

function SingleRangeSelectFacet({ label, onChange, options, values }) {
  const selectedFilterValue = values[0];

  const selectOptions = options.map(toSelectOption);

  const selectedOption = selectedFilterValue
    ? selectOptions.find(
        option =>
          option.value ===
          toValue(selectedFilterValue.from, selectedFilterValue.to)
      )
    : null;

  return (
    <div className="eco-search-facet">
      <div className="eco-search-facet-label">{label}</div>
      <Select
        className="eco-search-select-container"
        classNamePrefix="eco-search-select"
        components={{ Option }}
        value={selectedOption}
        onChange={o => onChange(toFilterValue(o))}
        options={selectOptions}
        isSearchable={false}
      />
    </div>
  );
}

SingleRangeSelectFacet.propTypes = {
  label: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(RangeFacetOption).isRequired,
  values: PropTypes.arrayOf(RangeFilterValue).isRequired
};

export default SingleRangeSelectFacet;
