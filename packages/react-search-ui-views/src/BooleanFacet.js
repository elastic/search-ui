import PropTypes from "prop-types";
import React from "react";

import { FacetValue, FilterValue } from "./types";
import { appendClassName } from "./view-helpers";

function BooleanFacet({
  className,
  label,
  options,
  onChange,
  onRemove,
  values
}) {
  const trueCount = options.find(option => option.value === "true").count;
  const isSelected = values.includes("true");

  const apply = () => onChange("true");
  const remove = () => onRemove("true");
  const toggle = () => {
    isSelected ? remove() : apply();
  };

  return (
    <fieldset className={appendClassName("sui-facet", className)}>
      <legend className="sui-facet__title">{label}</legend>
      <div className="sui-boolean-facet">
        <div className={"sui-boolean-facet__option-input-wrapper"}>
          <label className="sui-boolean-facet__option-label">
            <div className="sui-boolean-facet__option-input-wrapper">
              <input
                className="sui-boolean-facet__checkbox"
                type="checkbox"
                onChange={toggle}
              />
              <span className="sui-boolean-facet__input-text">{label}</span>
            </div>
            <span className="sui-boolean-facet__option-count">{trueCount}</span>
          </label>
        </div>
      </div>
    </fieldset>
  );
}

BooleanFacet.propTypes = {
  className: PropTypes.string,
  label: PropTypes.string.isRequired,
  onRemove: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(FacetValue).isRequired,
  values: PropTypes.arrayOf(FilterValue).isRequired,
  onChange: PropTypes.func.isRequired
};

export default BooleanFacet;
