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
    <div className="facet eco-search-facet">
      <div>
        <div className="facet__title">{label}</div>
        <ul className="facet__list">
          {value && (
            <li className="facet__selected">
              {value}{" "}
              <span className="facet__remove">
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
              <li className="facet__item" key={option.value}>
                <a
                  className="facet__link"
                  href="/"
                  onClick={e => {
                    e.preventDefault();
                    onSelect(option.value);
                  }}
                >
                  {option.value}
                </a>{" "}
                <span className="facet__count">{option.count}</span>
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
