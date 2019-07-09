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
  values,
  showSearch,
  onSearch,
  searchPlaceholder
}) {
  return (
    <fieldset
      className={appendClassName(
        "sui-multi-checkbox-facet sui-facet",
        className
      )}
    >
      <legend className="sui-multi-checkbox-facet__label">{label}</legend>

      {showSearch && (
        <div className="sui-facet-search">
          <input
            className="sui-facet-search__text-input"
            type="search"
            placeholder={searchPlaceholder || "Search"}
            onChange={e => {
              onSearch(e.target.value);
            }}
          />
        </div>
      )}

      <div className="sui-multi-checkbox-facet__options-list">
        {options.length < 1 && <div>No matching options</div>}
        {options.map(option => {
          const checked = !!values.find(value => {
            if (value && value.name && option.value.name === value.name)
              return true;
            if (deepEqual(option.value, value)) return true;
            return false;
          });
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
        <button
          type="button"
          className="sui-multi-checkbox-facet__view-more"
          onClick={onMoreClick}
          aria-label="Show more options"
        >
          + More
        </button>
      )}
    </fieldset>
  );
}

MultiCheckboxFacet.propTypes = {
  label: PropTypes.string.isRequired,
  onMoreClick: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
  onSelect: PropTypes.func.isRequired,
  onSearch: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(FacetValue).isRequired,
  showMore: PropTypes.bool.isRequired,
  values: PropTypes.arrayOf(FilterValue).isRequired,
  className: PropTypes.string,
  showSearch: PropTypes.bool,
  searchPlaceholder: PropTypes.string
};

export default MultiCheckboxFacet;
