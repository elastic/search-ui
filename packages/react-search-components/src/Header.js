import PropTypes from "prop-types";
import React from "react";

function Header({ children }) {
  return (
    <div className="reference-ui-header">
      <div className="reference-ui-header__search">{children}</div>
    </div>
  );
}

Header.propTypes = {
  children: PropTypes.node
};

export default Header;
