import PropTypes from "prop-types";
import React from "react";

import { FacetValue, FilterValue } from "./types";
import { appendClassName } from "./view-helpers";

function BooleanFacet({
  className,
  label,
  options,
  onChange,
  onRemove,
  values
}) {
  const trueCount = options.find(option => option.value === "true").count;
  const isSelected = values.includes("true");
  const isSelectedClass = isSelected ? "selected" : "";

  const apply = () => onChange("true");

  const remove = () => onRemove("true");

  return (
    <div
      className={appendClassName(isSelectedClass, className)}
      onClick={apply}
    >
      {label}{" "}
      {!isSelectedClass ? `(${trueCount})` : <span onClick={remove}>X</span>}
    </div>
  );
}

BooleanFacet.propTypes = {
  className: PropTypes.string,
  label: PropTypes.string.isRequired,
  onRemove: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(FacetValue).isRequired,
  values: PropTypes.arrayOf(FilterValue).isRequired,
  onChange: PropTypes.func.isRequired
};

export default BooleanFacet;
