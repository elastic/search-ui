import { SearchContextState } from "@elastic/search-ui";
import { useContext, useEffect, useState } from "react";

import SearchContext from "../SearchContext";

/**
 * React hook that provides access to Search UI state and actions
 *
 * @param mapContextToProps Optional function to select specific parts of the context
 * @returns Selected search context state and actions
 */
export function useSearch<T = SearchContextState>(
  mapContextToProps?: (context: SearchContextState) => T
): T {
  const context = useContext(SearchContext);

  if (!context) {
    throw new Error("useSearch must be used within a SearchProvider");
  }

  const [state, setState] = useState<T>(() =>
    mapContextToProps
      ? mapContextToProps({
          ...context.driver.getState(),
          ...context.driver.getActions()
        })
      : ({
          ...context.driver.getState(),
          ...context.driver.getActions()
        } as T)
  );

  useEffect(() => {
    const subscription = (newState: Partial<SearchContextState>) => {
      setState((prevState: T) => {
        const fullContext = {
          ...(prevState as any),
          ...newState
        };
        return mapContextToProps
          ? mapContextToProps(fullContext)
          : (fullContext as T);
      });
    };

    context.driver.subscribeToStateChanges(subscription);
    return () => {
      context.driver.unsubscribeToStateChanges(subscription);
    };
  }, [context.driver, mapContextToProps]);

  return state;
}

export default useSearch;
