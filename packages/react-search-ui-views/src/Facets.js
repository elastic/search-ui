import PropTypes from "prop-types";
import React from "react";

import { appendClassName } from "./view-helpers";

/**
 * @deprecated Since version 1.4. Will be deleted in version 2.0.
 */
function Facets({ children, className, ...rest }) {
  return (
    <div
      className={appendClassName("sui-facet-container", className)}
      {...rest}
    >
      {children}
    </div>
  );
}

Facets.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string
};

export default Facets;
