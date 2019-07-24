import PropTypes from "prop-types";
import React from "react";

import { appendClassName } from "../view-helpers";

class LayoutSidebar extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    children: PropTypes.node
  };

  constructor(props) {
    super(props);
    this.state = { isSidebarToggled: false };
  }

  toggleSidebar = () => {
    this.setState(({ isSidebarToggled }) => ({
      isSidebarToggled: !isSidebarToggled
    }));
  };

  renderToggleButton = label => {
    if (!this.props.children) return null;

    return (
      <button
        hidden
        type="button"
        className="sui-layout-sidebar-toggle"
        onClick={this.toggleSidebar}
      >
        {label}
      </button>
    );
  };

  render() {
    const { className, children } = this.props;
    const { isSidebarToggled } = this.state;

    const classes = appendClassName(
      className,
      isSidebarToggled ? `${className}--toggled` : null
    );

    return (
      <>
        {this.renderToggleButton("Show Filters")}
        <div className={classes}>
          {this.renderToggleButton("Save Filters")}
          {children}
        </div>
      </>
    );
  }
}

export default LayoutSidebar;
