import PropTypes from "prop-types";
import React from "react";

function Results({ viewHelpers, children, className, ...rest }) {
  return (
    <ul
      className={viewHelpers.appendClassName(
        "sui-results-container",
        className
      )}
      {...rest}
    >
      {children}
    </ul>
  );
}

Results.propTypes = {
  viewHelpers: PropTypes.object.isRequired,
  children: PropTypes.node.isRequired,
  className: PropTypes.string
};

export default Results;
