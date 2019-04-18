import PropTypes from "prop-types";
import React from "react";
import deepEqual from "deep-equal";

import { FacetValue, FilterValue } from "./types";
import { appendClassName, getFilterValueDisplay } from "./view-helpers";

function MultiCheckboxFacet({
  className,
  label,
  onMoreClick,
  onRemove,
  onSelect,
  options,
  showMore,
  values
}) {
  return (
    <div
      className={appendClassName(
        "sui-multi-checkbox-facet sui-facet",
        className
      )}
    >
      <div className="sui-multi-checkbox-facet__label">{label}</div>
      <div className="sui-multi-checkbox-facet__options-list">
        {options.map(option => {
          const checked = !!values.find(value =>
            deepEqual(option.value, value)
          );
          return (
            <label
              key={`${getFilterValueDisplay(option.value)}`}
              htmlFor={`example_facet_${label}${getFilterValueDisplay(
                option.value
              )}`}
              className="sui-multi-checkbox-facet__option-label"
            >
              <div className="sui-multi-checkbox-facet__option-input-wrapper">
                <input
                  id={`example_facet_${label}${getFilterValueDisplay(
                    option.value
                  )}`}
                  type="checkbox"
                  className="sui-multi-checkbox-facet__checkbox"
                  checked={checked}
                  onChange={() =>
                    checked ? onRemove(option.value) : onSelect(option.value)
                  }
                />
                <span className="sui-multi-checkbox-facet__input-text">
                  {getFilterValueDisplay(option.value)}
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
  options: PropTypes.arrayOf(FacetValue).isRequired,
  showMore: PropTypes.bool.isRequired,
  values: PropTypes.arrayOf(FilterValue).isRequired,
  className: PropTypes.string
};

export default MultiCheckboxFacet;
