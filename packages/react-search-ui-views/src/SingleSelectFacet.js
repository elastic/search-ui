import PropTypes from "prop-types";
import React from "react";
import deepEqual from "deep-equal";
import RRS from "react-responsive-select";
import { DownChevron } from ".";

import { FacetValue, FilterValue } from "./types";
import { getFilterValueDisplay } from "./view-helpers";
import { appendClassName } from "./view-helpers";

function Option({ label, count }) {
  return (
    <>
      <span className="rrs__option-label">{label}</span>
      <span className="rrs__option-count">{count.toLocaleString("en")}</span>
    </>
  );
}

Option.propTypes = {
  count: PropTypes.number.isRequired,
  label: PropTypes.string.isRequired
};

function toSelectOption({ value, count }) {
  return {
    value: value,
    text: getFilterValueDisplay(value),
    markup: Option({ label: value.name, count })
  };
}

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
      <RRS
        name="select"
        key={`facet_select_${selectedOption}`}
        options={selectOptions}
        onChange={o => onChange(o.value)}
        caretIcon={<DownChevron key={`facet_caret_${selectedOption}`} />}
        noSelectionLabel={
          !!values.length && (
            <span className="rrs__inline-placeholder">Select...</span>
          )
        }
        selectedValue={selectedOption && selectedOption.value}
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
