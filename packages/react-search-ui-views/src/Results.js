import PropTypes from "prop-types";
import React from "react";

import { appendClassName } from "./view-helpers";

function Results({ children, className }) {
  return (
    <ul className={appendClassName("sui-results-container", className)}>
      {children}
    </ul>
  );
}

Results.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string
};

export default Results;
