import PropTypes from "prop-types";
import React from "react";

import { FacetValue, FilterValue } from "./types";
import { getFilterValueDisplay } from "./view-helpers";
import { appendClassName } from "./view-helpers";

function SingleLinksFacet({
  className,
  label,
  onRemove,
  onSelect,
  options,
  values = []
}) {
  const value = values[0];
  return (
    <div className={appendClassName("sui-facet sui-search-facet", className)}>
      <div>
        <div className="sui-facet__title">{label}</div>
        <ul className="sui-facet__list">
          {value && (
            <li className="sui-facet__selected">
              {getFilterValueDisplay(value)}{" "}
              <span className="sui-facet__remove">
                (
                <a
                  onClick={e => {
                    e.preventDefault();
                    onRemove(value);
                  }}
                  href="/"
                >
                  Remove
                </a>
                )
              </span>
            </li>
          )}
          {!value &&
            options.map(option => (
              <li
                className="sui-facet__item"
                key={getFilterValueDisplay(option.value)}
              >
                <a
                  className="sui-facet__link"
                  href="/"
                  onClick={e => {
                    e.preventDefault();
                    onSelect(option.value);
                  }}
                >
                  {getFilterValueDisplay(option.value)}
                </a>{" "}
                <span className="sui-facet__count">{option.count}</span>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
}

SingleLinksFacet.propTypes = {
  label: PropTypes.string.isRequired,
  onRemove: PropTypes.func.isRequired,
  onSelect: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(FacetValue).isRequired,
  values: PropTypes.arrayOf(FilterValue).isRequired,
  className: PropTypes.string
};

export default SingleLinksFacet;
