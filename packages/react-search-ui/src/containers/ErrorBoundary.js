import PropTypes from "prop-types";
import React, { Component } from "react";
import { withSearch } from "..";
import { ErrorBoundary } from "@elastic/react-search-components";

export class ErrorBoundaryContainer extends Component {
  static propTypes = {
    // Props
    children: PropTypes.node.isRequired,
    render: PropTypes.func,
    // State
    error: PropTypes.string.isRequired
  };

  render() {
    const { render, ...rest } = this.props;

    const View = render || ErrorBoundary;

    return <View {...rest} />;
  }
}

export default withSearch(ErrorBoundaryContainer);
