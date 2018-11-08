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
    <div className="eco-search-facet">
      <div className="eco-search-facet-label">{label}</div>
      <div className="eco-search-facet-options">
        {options.map(option => {
          const checked = values.includes(option.value);
          return (
            <label
              key={`${option.value}`}
              htmlFor={`example_facet_${label}${option.value}`}
              className="eco-search-facet-option"
            >
              <input
                id={`example_facet_${label}${option.value}`}
                type="checkbox"
                className="eco-search-facet-option__input"
                checked={checked}
                onChange={() =>
                  checked ? onRemove(option.value) : onSelect(option.value)
                }
              />
              <span className="eco-search-facet-option__label">
                {option.value}
              </span>
              <span className="eco-search-facet-option__count">
                {option.count.toLocaleString("en")}
              </span>
            </label>
          );
        })}
      </div>
      {showMore && (
        <div className="eco-search-facet__view-more" onClick={onMoreClick}>
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
