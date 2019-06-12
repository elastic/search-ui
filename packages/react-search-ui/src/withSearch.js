import React from "react";

import SearchContext from "./SearchContext";

function buildContextForProps(context) {
  return {
    ...context.driver.getState(),
    ...context.driver.getActions()
  };
}

/* For a given object execute mapContextToProps to pluck out the relevant
properties */
function giveMeJustWhatINeeded(stateOrContext, mapContextToProps, props) {
  const mapContextToPropsToUse = props.mapContextToProps || mapContextToProps;
  return mapContextToPropsToUse(stateOrContext, props) || {};
}

/**
 * This is a Higher Order Component that wraps a component and injects state and actions from Search UI, effectively
 * "connecting" it to Search UI.
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
      constructor(props, context) {
        super();
        this.state = {
          ...giveMeJustWhatINeeded(
            buildContextForProps(context),
            // eslint-disable-next-line react/prop-types
            mapContextToProps,
            props
          )
        };

        // Note that we subscribe to changes at the component level, rather than
        // at the top level Provider, so that we are re-rendering the entire
        // subtree when state changes in the Provider.
        context.driver.subscribeToStateChanges(this.subscription);
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
              // persisted as well, which are not passed in the subscription param
              ...prevState,
              ...state
            },
            mapContextToProps,
            this.props
          )
        );
      };

      render() {
        // eslint-disable-next-line react/prop-types
        const { ...rest } = this.props;

        return <Component {...this.state} {...rest} />;
      }
    }

    WithSearch.contextType = SearchContext;
    return WithSearch;
  };
}
