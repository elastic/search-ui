import PropTypes from "prop-types";
import React from "react";

import { appendClassName } from "./view-helpers";

function Results({ children, className, ...rest }) {
  return (
    <ul
      className={appendClassName("sui-results-container", className)}
      {...rest}
    >
      {children}
    </ul>
  );
}

Results.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string
};

export default Results;
