import PropTypes from "prop-types";
import React from "react";

import { FacetValue, FilterValue } from "./types";
import { appendClassName, getFilterValueDisplay } from "./view-helpers";

function BooleanFacet({
  className,
  label,
  options,
  onChange,
  onRemove,
  onSelect,
  values
}) {
  // const trueOptions = options.map(option => option.value === "true")
  const trueCount = options.find(option => option.value === "true").count;
  const isSelected = values.includes("true");

  const isSelectedClass = isSelected ? "selected" : "";

  const apply = () => onChange("true");

  const remove = () => onRemove("true");

  return (
    <fieldset className={appendClassName("sui-facet", className)}>
      <legend className="sui-facet__title">{label}</legend>

      <div className="sui-boolean-facet">
        {options.map(option => {
          // console.log(option);
          const checked = values.includes("true");
          // const checked = !!values.find(value => {
          //   if (value && value.name && option.value.name === value.name)
          //     return true;
          //   if (deepEqual(option.value, value)) return true;
          //   return false;
          // });

          return (
            <div
              key={`${getFilterValueDisplay(option.value)}`}
              className={"sui-boolean-facet__option-input-wrapper"}
              onClick={apply}
            >
              <label className="sui-boolean-facet__option-label">
                <div className="sui-boolean-facet__option-input-wrapper">
                  <input
                    id={`example_facet_${label}${getFilterValueDisplay(
                      option.value
                    )}`}
                    className="sui-boolean-facet__checkbox"
                    type="checkbox"
                    name="checkbox"
                    value="value"
                    checked={checked}
                    onChange={() =>
                      checked ? onRemove("true") : onSelect("true")
                    }
                  />
                  <span className="sui-boolean-facet__input-text">
                    {`${getFilterValueDisplay(option.value)}`}
                  </span>
                </div>
                <span className="sui-boolean-facet__option-count">
                  {option.count.toLocaleString("en")}
                </span>
              </label>
            </div>
          );
        })}
        <div
          className={appendClassName(isSelectedClass, className)}
          onClick={apply}
        >
          {label}{" "}
          {!isSelectedClass ? (
            `(${trueCount})`
          ) : (
            <span onClick={remove}>X</span>
          )}
        </div>
      </div>
    </fieldset>
  );
}

BooleanFacet.propTypes = {
  className: PropTypes.string,
  label: PropTypes.string.isRequired,
  onRemove: PropTypes.func.isRequired,
  onSelect: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(FacetValue).isRequired,
  values: PropTypes.arrayOf(FilterValue).isRequired,
  onChange: PropTypes.func.isRequired
};

export default BooleanFacet;
