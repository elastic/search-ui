import PropTypes from "prop-types";
import React from "react";

import { FacetValue } from "./types";
import { getFilterValueDisplay } from "./view-helpers";
import { appendClassName } from "./view-helpers";

function SingleLinksFacet({ className, label, onRemove, onSelect, options }) {
  const value = options.filter(o => o.selected).map(o => o.value)[0];
  return (
    <div className={appendClassName("sui-facet", className)}>
      <div>
        <div className="sui-facet__title">{label}</div>
        <ul className="sui-single-option-facet">
          {value && (
            <li className="sui-single-option-facet__selected">
              {getFilterValueDisplay(value)}{" "}
              <span className="sui-single-option-facet__remove">
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
                className="sui-single-option-facet__item"
                key={getFilterValueDisplay(option.value)}
              >
                <a
                  className="sui-single-option-facet__link"
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
  className: PropTypes.string
};

export default SingleLinksFacet;
