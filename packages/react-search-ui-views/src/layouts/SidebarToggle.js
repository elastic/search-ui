import PropTypes from "prop-types";
import React from "react";

import { appendClassName } from "../view-helpers";

class SidebarToggle extends React.Component {
  static propTypes = { children: PropTypes.func };

  state = { isSidebarToggled: false };

  toggleSidebar = () => {
    this.setState(({ isSidebarToggled }) => ({
      isSidebarToggled: !isSidebarToggled
    }));
  };

  render() {
    const { isSidebarToggled } = this.state;

    const renderToggleButton = label => (
      <button
        hidden
        type="button"
        className="sui-layout-sidebar-toggle"
        onClick={this.toggleSidebar}
      >
        {label}
      </button>
    );

    const renderToggleClass = className =>
      appendClassName(
        className,
        isSidebarToggled ? `${className}--toggled` : null
      );

    return this.props.children({ renderToggleButton, renderToggleClass });
  }
}

export default SidebarToggle;
