import React from "react";

import SearchContext from "./SearchContext";

function buildContextForProps(context) {
  return {
    ...context.driver.getState(),
    ...context.driver.getActions()
  };
}

/* For a given object, pluck out the key/value pairs matching the keys
provided in the mapContextToProps parameter */
function giveMeJustWhatINeeded(stateOrContext, mapContextToProps) {
  return mapContextToProps(stateOrContext) || {};
}

/**
 * This is a Higher Order Component that wraps a component and injects state and actions from Search UI, effectively
 * "connecting" it to Search UI.
 *
 * `mapContextToProps` can be used to manipulate actions and state from context
 * before they are passed on to the container.
 *
 * Components using `withSearch` will be "Pure" components.
 * It is important to understand the implications of using a PureComponent, as described here:
 * https://reactjs.org/docs/optimizing-performance.html#examples
 *
 * @param Function mapContextToProps A function that accepts the context and allows you to pick the values to be passed as props
 * into the component. This allows you to "select" which values from the context to use.

 * @param Function Component
 */
export default function withSearch(mapContextToProps) {
  if (!mapContextToProps) {
    throw "withSearch requires a function to be provided which returns an object with at least one value.";
  }

  return function(Component) {
    class WithSearch extends React.PureComponent {
      constructor() {
        super();
        this.state = {};
      }

      componentDidMount() {
        // Note that we're doing this in CDM rather than the constructor, since
        // `this.context` is not yet available in the constructor
        this.setState({
          ...giveMeJustWhatINeeded(
            buildContextForProps(this.context),
            // eslint-disable-next-line react/prop-types
            this.props.mapContextToProps || mapContextToProps
          ),
          mounted: true
        });
        // Note that we subscribe to changes at the component level, rather than
        // at the top level Provider level, so that we are not over-rendering
        // at the top level of our component tree.
        this.context.driver.subscribeToStateChanges(this.subscription);
      }

      componentWillUnmount() {
        this.unmounted = true;
        this.context.driver.unsubscribeToStateChanges(this.subscription);
      }

      subscription = state => {
        if (this.unmounted) return;
        this.setState(prevState =>
          giveMeJustWhatINeeded(
            {
              // We pass prevState here instead of just state so that actions are
              // persisted as well, which are passed in the subscription
              ...prevState,
              ...state
            },
            mapContextToProps
          )
        );
      };

      render() {
        if (!this.state.mounted) return null;

        // eslint-disable-next-line react/prop-types
        const { ...rest } = this.props;

        return <Component {...this.state} {...rest} />;
      }
    }

    WithSearch.contextType = SearchContext;
    return WithSearch;
  };
}
