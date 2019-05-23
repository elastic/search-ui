import React from "react";

import SearchContext from "./SearchContext";

/**
 * This is a Higher Order Component that is used to expose (as `props`) all
 * State and Actions provided by the SearchProvider to "container"
 * components.
 *
 * `mapContextToProps` can be used to manipulate actions and state from context
 * before they are passed on to the container.
 *
 * Components using `withSearch` will be "Pure" components. A "shouldComponentUpdate" is implemented
 * below to ensure that components only render when state has changed.
 */

function buildContextForProps(context) {
  return {
    ...context.driver.getState(),
    ...context.driver.getActions()
  };
}

/* For a given object, pluck out the key/value pairs matching the keys
provided in the deps parameter */
function giveMeJustWhatINeeded(stateOrContext, deps) {
  if (deps.length === 0) return stateOrContext;
  return deps.reduce((acc, dep) => {
    if (!stateOrContext.hasOwnProperty(dep)) return acc;
    return {
      ...acc,
      [dep]: stateOrContext[dep]
    };
  }, {});
}

/**
 * Wrap a component and inject state and actions from Search UI, effectively
 * "connecting" it to Search UI.
 *
 * @param Array[String] deps An array of state or action values to be injected as props into the component. Provide
 * an empty array for all state and actions. This is not desirable because it can have bad performance characteristics
 * as the component would then render every time state is updated in Search UI.
 * @param Function Component
 */
export default function withSearch(deps = [], Component) {
  class WithSearch extends React.PureComponent {
    constructor() {
      super();
      this.state = {};
      this.deps = deps;
    }

    componentWillMount() {
      this.setState(
        giveMeJustWhatINeeded(buildContextForProps(this.context), this.deps)
      );
      // Note that we subscribe to changes at the component level, rather than
      // at the top level Provider level, so that we are over-rendering
      // at the top level of our component tree.
      this.context.driver.subscribeToStateChanges(this.subscription);
    }

    componentWillUnmount() {
      this.unmounted = true;
      this.context.driver.unsubscribeToStateChanges(this.subscription);
    }

    subscription = state => {
      if (this.unmounted) return;
      this.setState(giveMeJustWhatINeeded(state, this.deps));
    };

    render() {
      // eslint-disable-next-line react/prop-types
      const { mapContextToProps = context => context, ...rest } = this.props;

      return <Component {...mapContextToProps(this.state)} {...rest} />;
    }
  }

  WithSearch.contextType = SearchContext;
  return WithSearch;
}
