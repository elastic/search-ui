import PropTypes from "prop-types";
import React from "react";
import ReactDOM from "react-dom";

import { appendClassName } from "../view-helpers";

class SidebarToggle extends React.Component {
  static propTypes = {
    children: PropTypes.func,
    content: PropTypes.node
  };

  constructor(props) {
    super(props);
    this.state = { isSidebarToggled: false };
    this.checkContent = document.createElement("div");
  }

  toggleSidebar = () => {
    this.setState(({ isSidebarToggled }) => ({
      isSidebarToggled: !isSidebarToggled
    }));
  };

  render() {
    const { content } = this.props;
    if (!content) return null;

    ReactDOM.render(content, this.checkContent);
    const hasSidebarContent = Boolean(this.checkContent.innerText);
    if (!hasSidebarContent) return null;

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
