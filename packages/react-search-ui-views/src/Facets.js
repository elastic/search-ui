import PropTypes from "prop-types";
import React from "react";

import { appendClassName } from "./view-helpers";

function Facets({ children, className }) {
  return (
    <div className={appendClassName("sui-facet-container", className)}>
      {children}
    </div>
  );
}

Facets.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string
};

export default Facets;
