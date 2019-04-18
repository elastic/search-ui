import PropTypes from "prop-types";
import React from "react";

import { appendClassName } from "./view-helpers";

function ErrorBoundary({ children, className, error }) {
  if (error) {
    return (
      <div className={appendClassName("sui-search-error", className)}>
        {error}
      </div>
    );
  }

  return children;
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
  error: PropTypes.string.isRequired,
  className: PropTypes.string
};

export default ErrorBoundary;
