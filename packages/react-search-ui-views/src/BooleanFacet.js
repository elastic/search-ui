import PropTypes from "prop-types";
import React from "react";

function BooleanFacet({
  viewHelpers,
  className,
  label,
  options,
  onChange,
  onRemove,
  values
}) {
  const trueOptions = options.find(option => option.value === "true");
  if (!trueOptions) return null;
  const isSelected = values.includes("true");

  const apply = () => onChange("true");
  const remove = () => onRemove("true");
  const toggle = () => {
    isSelected ? remove() : apply();
  };

  return (
    <fieldset className={viewHelpers.appendClassName("sui-facet", className)}>
      <legend className="sui-facet__title">{label}</legend>
      <div className="sui-boolean-facet">
        <div className={"sui-boolean-facet__option-input-wrapper"}>
          <label className="sui-boolean-facet__option-label">
            <div className="sui-boolean-facet__option-input-wrapper">
              <input
                className="sui-boolean-facet__checkbox"
                type="checkbox"
                onChange={toggle}
                checked={isSelected}
              />
              <span className="sui-boolean-facet__input-text">{label}</span>
            </div>
            <span className="sui-boolean-facet__option-count">
              {trueOptions.count}
            </span>
          </label>
        </div>
      </div>
    </fieldset>
  );
}

BooleanFacet.propTypes = {
  viewHelpers: PropTypes.object.isRequired,
  className: PropTypes.string,
  label: PropTypes.string.isRequired,
  onRemove: PropTypes.func.isRequired,
  options: PropTypes.array.isRequired,
  values: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired
};

export default BooleanFacet;
