import PropTypes from "prop-types";
import React, { useState, useEffect } from "react";

import { SearchDriver } from "@elastic/search-ui";
import SearchContext from "./SearchContext";

import defaultA11yMessages from "./A11yNotifications";

/**
 * The SearchProvider primarily holds a reference to the SearchDriver and
 * exposes it to the rest of the application in a Context.
 */
const SearchProvider = ({ children, config }) => {
  const [driver, setDriver] = useState(null);

  useEffect(() => {
    // This initialization is done inside of useEffect, because initializing the SearchDriver server side
    // will error out, since the driver depends on window. Placing the initialization inside of useEffect
    // assures that it won't attempt to initialize server side.
    const newDriver = new SearchDriver({
      ...config,
      a11yNotificationMessages: {
        ...defaultA11yMessages,
        ...config.a11yNotificationMessages
      }
    });
    setDriver(newDriver);
    return () => {
      newDriver.tearDown();
    };
  }, []);

  // Since driver is initialized in useEffect above, we are waiting
  // to render until the driver is available.
  if (!driver) return null;

  // Passing the entire "this.state" to the Context is significant. Because
  // Context determines when to re-render based on referential identity
  // something like this could cause unnecessary renders:
  //
  // <SearchContext.Provider value={{driver: this.state.driver}}>
  //
  // By passing the entire state, we ensure that re-renders only occur when
  // state is actually updated.
  return (
    <SearchContext.Provider value={{ driver }}>
      {children}
    </SearchContext.Provider>
  );
};

SearchProvider.propTypes = {
  children: PropTypes.node.isRequired,
  // Not providing a shape here because the shape matches the shape of
  // SearchDriver. SearchDriver can do it's own parameter validation.
  config: PropTypes.object
};

export default SearchProvider;
