import React from "react";
import Select, { components } from "react-select";
import type { OptionProps } from "react-select";

import { FacetViewProps } from "./types";
import { getFilterValueDisplay } from "./view-helpers";
import { appendClassName } from "./view-helpers";

interface OptionDataProps {
  label: string;
  count: number;
}

function Option(props: OptionProps<OptionDataProps>) {
  return (
    <components.Option {...props}>
      <span className="sui-select__option-label">{props.data.label}</span>
      <span className="sui-select__option-count">
        {props.data.count.toLocaleString("en")}
      </span>
    </components.Option>
  );
}

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

function SingleSelectFacet({
  className,
  label,
  onChange,
  options
}: FacetViewProps) {
  let selectedSelectBoxOption;
  let isSelectedSelectBoxOptionSet = false;

  const selectBoxOptions = options.map((option) => {
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
        components={{
          Option: (props) => {
            props.innerProps["data-transaction-name"] = `facet - ${label}`;
            return Option(props);
          }
        }}
        value={selectedSelectBoxOption}
        onChange={(o) => onChange(o.value)}
        options={selectBoxOptions}
        isSearchable={false}
        styles={setDefaultStyle}
      />
    </div>
  );
}

export default SingleSelectFacet;
