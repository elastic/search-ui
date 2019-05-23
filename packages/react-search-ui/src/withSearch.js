import React from "react";

import SearchContext from "./SearchContext";
import areEqualShallow from "./helpers/areShallowEqual";

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

export default function withSearch(Component) {
  class WithSearch extends React.Component {
    constructor() {
      super();
      this.state = {};
    }

    shouldComponentUpdate(nextProps, nextState) {
      // Since ALL state and actions are passed to our components from the state
      // tree, we need to make sure that only state changes on state that a
      // component cares about trigger updates. Otherwise we will have
      // severe over-rendering.
      //
      // We determine which state properties a component cares about by looking
      // at their propTypes, hence the "Component.propTypes" usage below.
      if (
        areEqualShallow(
          this.state,
          nextState,
          Object.keys(Component.propTypes)
        ) !== true
      ) {
        return true;
      }
      if (
        areEqualShallow(
          this.props,
          nextProps,
          Object.keys(Component.propTypes)
        ) !== true
      ) {
        return true;
      }

      return false;
    }

    componentWillMount() {
      this.setState(buildContextForProps(this.context));
      // Note that we subscribe to changes at the component level, rather than
      // at the top level driver level, so that are are not triggering renders
      // at the top level of our component tree.
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
      // eslint-disable-next-line react/prop-types
      const { mapContextToProps = context => context, ...rest } = this.props;

      return <Component {...mapContextToProps(this.state)} {...rest} />;
    }
  }

  WithSearch.contextType = SearchContext;
  return WithSearch;
}
