import PropTypes from "prop-types";
import React, { Component } from "react";
import { withSearch } from "..";
import { ErrorBoundary } from "@elastic/react-search-ui-views";

export class ErrorBoundaryContainer extends Component {
  static propTypes = {
    // Props
    children: PropTypes.node.isRequired,
    view: PropTypes.func,
    // State
    error: PropTypes.string.isRequired
  };

  render() {
    const { view, ...rest } = this.props;

    const View = view || ErrorBoundary;

    return View(rest);
  }
}

export default withSearch(ErrorBoundaryContainer);
