import PropTypes from "prop-types";
import React, { Component } from "react";
import { withSearch } from "..";
import { ErrorBoundary } from "@elastic/react-search-components";

export class ErrorBoundaryContainer extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    error: PropTypes.string.isRequired
  };

  render() {
    return <ErrorBoundary {...this.props} />;
  }
}

export default withSearch(ErrorBoundaryContainer);
