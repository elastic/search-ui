import PropTypes from "prop-types";
import React from "react";
import Select, { components } from "react-select";

import { FacetValue } from "./types";
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

function toSelectBoxOption(filterValue) {
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

function SingleSelectFacet({ className, label, onChange, options }) {
  let selectedSelectBoxOption;
  let isSelectedSelectBoxOptionSet = false;

  const selectBoxOptions = options.map(option => {
    const selectBoxOption = toSelectBoxOption(option);
    // There should never be multiple filters set for this facet because it is single select,
    // but if there is, we use the first value.
    if (option.selected && !isSelectedSelectBoxOptionSet) {
      selectedSelectBoxOption = selectBoxOption;
      isSelectedSelectBoxOptionSet = true;
    }
    return selectBoxOption;
  });

  return (
    <div className={appendClassName("sui-facet", className)}>
      <div className="sui-facet__title">{label}</div>
      <Select
        className="sui-select"
        classNamePrefix="sui-select"
        components={{ Option }}
        value={selectedSelectBoxOption}
        onChange={o => onChange(o.value)}
        options={selectBoxOptions}
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
  className: PropTypes.string
};

export default SingleSelectFacet;
