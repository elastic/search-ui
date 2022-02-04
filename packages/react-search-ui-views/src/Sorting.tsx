import { SortingViewProps } from "@elastic/react-search-ui";
import React from "react";
import Select from "react-select";

import { appendClassName } from "./view-helpers";

const setDefaultStyle = {
  option: () => ({}),
  control: () => ({}),
  dropdownIndicator: () => ({}),
  indicatorSeparator: () => ({})
};

function Sorting({
  className,
  label,
  onChange,
  options,
  value,
  ...rest
}: SortingViewProps) {
  const selectedValue = value;

  const selectedOption = selectedValue
    ? options.find((option) => option.value === selectedValue)
    : null;

  return (
    <div className={appendClassName("sui-sorting", className)} {...rest}>
      {label && <div className="sui-sorting__label">{label}</div>}
      <Select
        className="sui-select"
        classNamePrefix="sui-select"
        value={selectedOption}
        onChange={(o) => onChange(o.value)}
        options={options}
        isSearchable={false}
        styles={setDefaultStyle}
      />
    </div>
  );
}

export default Sorting;
