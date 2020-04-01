import PropTypes from "prop-types";
import React from "react";

function ErrorBoundary({ viewHelpers, children, className, error, ...rest }) {
  if (error) {
    return (
      <div
        className={viewHelpers.appendClassName("sui-search-error", className)}
        {...rest}
      >
        {error}
      </div>
    );
  }

  return children;
}

ErrorBoundary.propTypes = {
  viewHelpers: PropTypes.object.isRequired,
  children: PropTypes.node.isRequired,
  error: PropTypes.string.isRequired,
  className: PropTypes.string
};

export default ErrorBoundary;
