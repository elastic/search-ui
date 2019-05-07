import React from "react";

import SearchConsumer from "./SearchConsumer";

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
  return function WithSearch(props) {
    // eslint-disable-next-line react/prop-types
    const { mapContextToProps = context => context, ...rest } = props;

    return (
      <SearchConsumer>
        {context => (
          <Component
            {...mapContextToProps(buildContextForProps(context))}
            {...rest}
          />
        )}
      </SearchConsumer>
    );
  };
}
