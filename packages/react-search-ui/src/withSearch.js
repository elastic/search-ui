import React from "react";

import SearchContext from "./SearchContext";

function buildContextForProps(context) {
  return {
    ...context.driver.getState(),
    ...context.driver.getActions()
  };
}

/* For a given object, pluck out the key/value pairs matching the keys
provided in the uses parameter */
function giveMeJustWhatINeeded(stateOrContext, uses) {
  if (uses.length === 0) return stateOrContext;
  return uses.reduce((acc, use) => {
    if (!stateOrContext.hasOwnProperty(use)) return acc;
    return {
      ...acc,
      [use]: stateOrContext[use]
    };
  }, {});
}

/**
 * This is a Higher Order Component that wraps a component and injects state and actions from Search UI, effectively
 * "connecting" it to Search UI.
 *
 * `mapContextToProps` can be used to manipulate actions and state from context
 * before they are passed on to the container.
 *
 * Components using `withSearch` will be "Pure" components. A "shouldComponentUpdate" is implemented
 * below to ensure that components only render when state has changed.
 *
 * It is important to understand the implications of using a PureComponent, as described here:
 * https://reactjs.org/docs/optimizing-performance.html#examples
 *
 * @param Array[String] uses An array of state or action values to be injected as props into the component. Provide
 * an empty array for all state and actions. This is not desirable because it can have bad performance characteristics
 * as the component would then render every time state is updated in Search UI.
 * @param Function Component
 */
export default function withSearch(uses = [], Component) {
  class WithSearch extends React.PureComponent {
    constructor() {
      super();
      this.state = {};
    }

    componentDidMount() {
      // Note that we're doing this in CDM rather than the constructor, since
      // `this.context` is not yet available in the constructor
      this.setState(
        giveMeJustWhatINeeded(buildContextForProps(this.context), uses)
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
      this.setState(giveMeJustWhatINeeded(state, uses));
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
