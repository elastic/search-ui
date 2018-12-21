import PropTypes from "prop-types";
import React from "react";

function Facets({ children }) {
  return <div className="sui-facet-container">{children}</div>;
}

Facets.propTypes = {
  children: PropTypes.node.isRequired
};

export default Facets;
