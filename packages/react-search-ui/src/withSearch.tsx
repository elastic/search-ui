import React from "react";

import SearchContext from "./SearchContext";
import { SearchDriver } from "@elastic/search-ui";
import { SearchState, SearchDriverActions } from "@elastic/search-ui";

export type SearchContextState = SearchState & SearchDriverActions;

function buildContextForProps(context: {
  driver: SearchDriver;
}): SearchContextState {
  return {
    ...context.driver.getState(),
    ...context.driver.getActions()
  };
}

/* For a given object execute mapContextToProps to pluck out the relevant
properties */
function giveMeJustWhatINeeded(
  stateOrContext: SearchContextState,
  mapContextToProps: (context: SearchContextState) => any,
  props: any
): Partial<SearchContextState> & Record<string, any> {
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

type withSearchProps<T> = {
  mapContextToProps?: (context: SearchContextState) => T;
};

function withSearch<TProps, TContext>(
  mapContextToProps: (context: SearchContextState) => TContext
): (
  Component: React.ComponentType<any>
) => React.ComponentType<
  Omit<TProps, keyof TContext> & withSearchProps<TContext>
> {
  if (!mapContextToProps) {
    throw "withSearch requires a function to be provided which returns an object with at least one value.";
  }

  return function (Component: React.ComponentType<any>) {
    class WithSearch extends React.PureComponent<Omit<TProps, keyof TContext>> {
      static contextType = SearchContext;
      declare context: React.ContextType<typeof SearchContext>;
      mounted: boolean;

      constructor(props, context) {
        super(props);
        this.mounted = false;
        this.state = {
          ...giveMeJustWhatINeeded(
            buildContextForProps(context),
            mapContextToProps,
            props
          )
        };
      }

      componentDidMount() {
        this.mounted = true;
        // Note that we subscribe to changes at the component level, rather than
        // at the top level Provider, so that we are re-rendering the entire
        // subtree when state changes in the Provider.
        this.context.driver.subscribeToStateChanges(this.subscription);
      }

      componentWillUnmount() {
        this.mounted = false;
        this.context.driver.unsubscribeToStateChanges(this.subscription);
      }

      subscription = (state) => {
        if (!this.mounted) return;
        this.setState((prevState) =>
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
        const { ...rest } = this.props;

        return <Component {...this.state} {...rest} />;
      }
    }

    return WithSearch;
  };
}

export default withSearch;
