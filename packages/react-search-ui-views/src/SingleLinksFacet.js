import PropTypes from "prop-types";
import React from "react";

function SingleLinksFacet({
  viewHelpers,
  className,
  label,
  onRemove,
  onSelect,
  options
}) {
  const value = options.filter(o => o.selected).map(o => o.value)[0];
  return (
    <div className={viewHelpers.appendClassName("sui-facet", className)}>
      <div>
        <div className="sui-facet__title">{label}</div>
        <ul className="sui-single-option-facet">
          {value && (
            <li className="sui-single-option-facet__selected">
              {viewHelpers.getFilterValueDisplay(value)}{" "}
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
                key={viewHelpers.getFilterValueDisplay(option.value)}
              >
                <a
                  className="sui-single-option-facet__link"
                  href="/"
                  onClick={e => {
                    e.preventDefault();
                    onSelect(option.value);
                  }}
                >
                  {viewHelpers.getFilterValueDisplay(option.value)}
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
  viewHelpers: PropTypes.object.isRequired,
  label: PropTypes.string.isRequired,
  onRemove: PropTypes.func.isRequired,
  onSelect: PropTypes.func.isRequired,
  options: PropTypes.array.isRequired,
  className: PropTypes.string
};

export default SingleLinksFacet;
