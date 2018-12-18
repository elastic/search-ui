import PropTypes from "prop-types";
import React, { Component } from "react";
import { SearchDriver } from "@elastic/search-ui";

import SearchContext from "./SearchContext";

/**
 * The SearchProvider is the glue that connects the SearchDriver to
 * our React App.
 *
 * It "subscribes" to the SearchDriver in order to be notified of state
 * changes. It then syncs that state with its own state and passes that state
 * down to child components in a React Context. It will also pass down "Actions"
 * from the SearchDriver, which allow child components to update state.
 *
 * Any "Container" component placed within this context will have access
 * to the Driver's state and Actions.
 *
 */
class SearchProvider extends Component {
  static propTypes = {
    children: PropTypes.func.isRequired,
    // TODO These should all be TS types
    config: PropTypes.shape({
      apiConnector: PropTypes.shape({
        click: PropTypes.func.isRequired,
        search: PropTypes.func.isRequired
      }).isRequired,
      facets: PropTypes.object,
      initialState: PropTypes.object,
      searchOptions: PropTypes.object,
      trackUrlState: PropTypes.bool
    })
  };

  constructor(props) {
    super(props);
    this.driver = new SearchDriver(props.config);
    this.state = this.driver.getState();
    this.driver.subscribeToStateChanges(state => this.setState(state));
  }

  render() {
    const { children } = this.props;

    const providerValue = {
      ...this.state,
      ...this.driver.getActions()
    };

    return (
      <SearchContext.Provider value={providerValue}>
        {children(providerValue)}
      </SearchContext.Provider>
    );
  }
}

export default SearchProvider;
