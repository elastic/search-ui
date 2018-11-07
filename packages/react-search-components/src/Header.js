import React from "react";

export default function Header({ children }) {
  return (
    <div className="reference-ui-header">
      <div className="reference-ui-header__search">{children}</div>
    </div>
  );
}
