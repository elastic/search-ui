import PropTypes from "prop-types";
import React from "react";

import { ValueFacetOption, ValueFilterValue } from "./types";

function SingleValueLinksFacet({
  label,
  onRemove,
  onSelect,
  options,
  values = []
}) {
  const value = values[0];
  return (
    <div className="sui-facet sui-search-facet">
      <div>
        <div className="sui-facet__title">{label}</div>
        <ul className="sui-facet__list">
          {value && (
            <li className="sui-facet__selected">
              {value}{" "}
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
              <li className="sui-facet__item" key={option.value}>
                <a
                  className="sui-facet__link"
                  href="/"
                  onClick={e => {
                    e.preventDefault();
                    onSelect(option.value);
                  }}
                >
                  {option.value}
                </a>{" "}
                <span className="sui-facet__count">{option.count}</span>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
}

SingleValueLinksFacet.propTypes = {
  label: PropTypes.string.isRequired,
  onRemove: PropTypes.func.isRequired,
  onSelect: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(ValueFacetOption).isRequired,
  values: PropTypes.arrayOf(ValueFilterValue)
};

export default SingleValueLinksFacet;
