import PropTypes from "prop-types";
import React, { Component } from "react";
import { SearchDriver } from "@elastic/search-ui";

import SearchContext from "./SearchContext";

/**
 * The SearchProvider primarily holds a reference to the SearchDriver and
 * exposes it to the rest of the application in a Context.
 *
 * Any "Container" component nested within this component will have access
 * to the Driver's state and Actions.
 *
 */
class SearchProvider extends Component {
  static propTypes = {
    children: PropTypes.node,
    // Not providing a shape here because the shape matches the shape of
    // SearchDriver. SearchDriver can do it's own parameter validation.
    config: PropTypes.object
  };

  constructor() {
    super();
    this.state = {
      driver: null
    };
  }

  componentDidMount() {
    const { config } = this.props;
    this.driver = new SearchDriver(config);
    this.setState({
      driver: this.driver
    });
  }

  componentWillUnmount() {
    this.driver.tearDown();
  }

  render() {
    const { children } = this.props;

    if (!this.state.driver) return null;

    const providerValue = {
      driver: this.state.driver
    };

    return (
      <SearchContext.Provider value={providerValue}>
        {children}
      </SearchContext.Provider>
    );
  }
}

export default SearchProvider;
