import PropTypes from "prop-types";
import React from "react";

import { ValueFacetOption, ValueFilterValue } from "./types";

function MultiValueFacet({
  label,
  onMoreClick,
  onRemove,
  onSelect,
  options,
  showMore,
  values
}) {
  return (
    <div className="sui-search-facet">
      <div className="sui-search-facet-label">{label}</div>
      <div className="sui-search-facet-options">
        {options.map(option => {
          const checked = values.includes(option.value);
          return (
            <label
              key={`${option.value}`}
              htmlFor={`example_facet_${label}${option.value}`}
              className="sui-search-facet-option"
            >
              <input
                id={`example_facet_${label}${option.value}`}
                type="checkbox"
                className="sui-search-facet-option__input"
                checked={checked}
                onChange={() =>
                  checked ? onRemove(option.value) : onSelect(option.value)
                }
              />
              <span className="sui-search-facet-option__label">
                {option.value}
              </span>
              <span className="sui-search-facet-option__count">
                {option.count.toLocaleString("en")}
              </span>
            </label>
          );
        })}
      </div>
      {showMore && (
        <div className="sui-search-facet__view-more" onClick={onMoreClick}>
          + More
        </div>
      )}
    </div>
  );
}

MultiValueFacet.propTypes = {
  label: PropTypes.string.isRequired,
  onMoreClick: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
  onSelect: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(ValueFacetOption).isRequired,
  showMore: PropTypes.bool.isRequired,
  values: PropTypes.arrayOf(ValueFilterValue).isRequired
};

export default MultiValueFacet;
