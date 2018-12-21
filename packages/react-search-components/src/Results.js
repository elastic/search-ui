import PropTypes from "prop-types";
import React from "react";

function Results({ children }) {
  return <ul className="sui-results-container">{children}</ul>;
}

Results.propTypes = {
  children: PropTypes.node.isRequired
};

export default Results;
