import PropTypes from "prop-types";
import React, { Component } from "react";

import { SearchDriver } from "@elastic/search-ui";
import SearchContext from "./SearchContext";

/**
 * The SearchProvider primarily holds a reference to the SearchDriver and
 * exposes it to the rest of the application in a Context.
 */
class SearchProvider extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
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
    // This initialization is done inside of componentDidMount, because initializing the SearchDriver server side
    // will error out, since the driver depends on window. Placing the initialization inside of componentDidMount
    // assures that it won't attempt to initialize server side.
    const driver = new SearchDriver(config);
    this.setState({
      driver
    });
  }

  componentWillUnmount() {
    this.state.driver.tearDown();
  }

  render() {
    const { children } = this.props;

    // Since driver is initialized in componentDidMount above, we are waiting
    // to render until the driver is available.
    if (!this.state.driver) return null;

    // Passing the entire "this.state" to the Context is significant. Because
    // Context determines when to re-render based on referential identity
    // something like this could cause unnecessary renders:
    //
    // <SearchContext.Provider value={{driver: this.state.driver}}>
    //
    // By passing the entire state, we ensure that re-renders only occur when
    // state is actually updated.
    return (
      <SearchContext.Provider value={this.state}>
        {children}
      </SearchContext.Provider>
    );
  }
}

export default SearchProvider;
