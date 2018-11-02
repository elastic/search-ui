import PropTypes from "prop-types";
import React from "react";

import { FacetOption } from "./types";

function Facet({ name, onRemove, onSelect, options, value }) {
  return (
    <div className="facet">
      <div>
        <div className="facet__title">{name}</div>
        <ul className="facet__list">
          {value && (
            <li className="facet__selected">
              {value}{" "}
              <span className="facet__remove">
                (
                <a
                  onClick={clickEvent => onRemove({ clickEvent, value })}
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
                  onClick={clickEvent =>
                    onSelect({ clickEvent, value: option.value })
                  }
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

Facet.propTypes = {
  name: PropTypes.string.isRequired,
  onRemove: PropTypes.func.isRequired,
  onSelect: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(FacetOption).isRequired,
  value: PropTypes.string
};

export default Facet;
