import PropTypes from "prop-types";
import React from "react";

function ErrorBoundary({ children, error }) {
  if (error) {
    return <div className="sui-search-error">{error}</div>;
  }

  return children;
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
  error: PropTypes.string.isRequired
};

export default ErrorBoundary;
