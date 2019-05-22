import React from "react";

import SearchContext from "./SearchContext";

/**
 * This is a Higher Order Component that is used to expose (as `props`) all
 * state and Actions provided by the SearchProvider to "container"
 * components.
 *
 * `mapContextToProps` can be used to manipulate actions and state from context
 * before they are passed on to the container.
 */

function buildContextForProps(context) {
  return {
    ...context.driver.getState(),
    ...context.driver.getActions()
  };
}

export default function withSearch(Component) {
  class WithSearch extends React.Component {
    constructor() {
      super();
      this.state = {};
    }

    componentWillMount() {
      this.setState(buildContextForProps(this.context));
      this.context.driver.subscribeToStateChanges(this.subscription);
    }

    componentWillUnmount() {
      this.unmounted = true;
      this.context.driver.unsubscribeToStateChanges(this.subscription);
    }

    subscription = state => {
      if (this.unmounted) return;
      this.setState(state);
    };

    render() {
      // TODO Perf
      // eslint-disable-next-line react/prop-types
      const { mapContextToProps = context => context, ...rest } = this.props;

      return <Component {...mapContextToProps(this.state)} {...rest} />;
    }
  }

  WithSearch.contextType = SearchContext;
  return WithSearch;
}
