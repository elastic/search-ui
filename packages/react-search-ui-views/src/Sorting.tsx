import React from "react";
import Select, { components, OptionProps } from "react-select";
import { BaseContainerProps } from "./types";

import { appendClassName } from "./view-helpers";

const setDefaultStyle = {
  option: () => ({}),
  control: () => ({}),
  dropdownIndicator: () => ({}),
  indicatorSeparator: () => ({})
};

export type SortingViewProps = BaseContainerProps &
  Pick<SortingContainerProps, "label"> & {
    onChange: (sortData?: any) => void;
    options: {
      value: string;
      label: string;
    }[];
    value: string;
  };

export type SortingContainerProps = BaseContainerProps & {
  view?: React.ComponentType<SortingViewProps>;
  label?: string;
  sortOptions: any;
};

interface OptionDataProps {
  label: string;
}

function Option(props: OptionProps<OptionDataProps>) {
  return <components.Option {...props}>{props.data.label}</components.Option>;
}

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
        components={{
          Option: (props) => {
            props.innerProps["data-transaction-name"] = `sorting`;
            return Option(props);
          }
        }}
      />
    </div>
  );
}

export default Sorting;
