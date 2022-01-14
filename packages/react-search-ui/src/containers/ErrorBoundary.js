import PropTypes from "prop-types";
import React, { Component } from "react";
import { withSearch } from "..";
import { ErrorBoundary } from "@elastic/react-search-ui-views";

export class ErrorBoundaryContainer extends Component {
  static propTypes = {
    // Props
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
    view: PropTypes.func,
    // State
    error: PropTypes.string.isRequired
  };

  render() {
    const { children, className, error, view, ...rest } = this.props;

    const View = view || ErrorBoundary;

    const viewProps = {
      className,
      children,
      error,
      ...rest
    };

    return <View {...viewProps} />;
  }
}

export default withSearch(({ error }) => ({ error }))(ErrorBoundaryContainer);
