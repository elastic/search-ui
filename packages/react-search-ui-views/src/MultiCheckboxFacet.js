import PropTypes from "prop-types";
import React from "react";

import { ValueFacetOption, ValueFilterValue } from "./types";

function MultiCheckboxFacet({
  label,
  onMoreClick,
  onRemove,
  onSelect,
  options,
  showMore,
  values
}) {
  return (
    <div className="sui-multi-checkbox-facet sui-facet">
      <div className="sui-multi-checkbox-facet__label">{label}</div>
      <div className="sui-multi-checkbox-facet__options-list">
        {options.map(option => {
          const checked = values.includes(option.value);
          return (
            <label
              key={`${option.value}`}
              htmlFor={`example_facet_${label}${option.value}`}
              className="sui-multi-checkbox-facet__option-label"
            >
              <div className="sui-multi-checkbox-facet__option-input-wrapper">
                <input
                  id={`example_facet_${label}${option.value}`}
                  type="checkbox"
                  className="sui-multi-checkbox-facet__checkbox"
                  checked={checked}
                  onChange={() =>
                    checked ? onRemove(option.value) : onSelect(option.value)
                  }
                />
                <span className="sui-multi-checkbox-facet__input-text">
                  {option.value}
                </span>
              </div>
              <span className="sui-multi-checkbox-facet__option-count">
                {option.count.toLocaleString("en")}
              </span>
            </label>
          );
        })}
      </div>
      {showMore && (
        <div
          className="sui-multi-checkbox-facet__view-more"
          onClick={onMoreClick}
        >
          + More
        </div>
      )}
    </div>
  );
}

MultiCheckboxFacet.propTypes = {
  label: PropTypes.string.isRequired,
  onMoreClick: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
  onSelect: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(ValueFacetOption).isRequired,
  showMore: PropTypes.bool.isRequired,
  values: PropTypes.arrayOf(ValueFilterValue).isRequired
};

export default MultiCheckboxFacet;
