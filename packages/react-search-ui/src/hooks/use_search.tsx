import { createContext, useContext } from "react";

import type { SearchContextState } from "@elastic/search-ui";

export const UseSearchContext = createContext<SearchContextState | undefined>(
  undefined
);

export const useSearch = () => {
  const context = useContext(UseSearchContext);
  if (context === undefined) {
    throw new Error("useSearch must be used within a SearchContextProvider");
  }
  return context;
};

export default useSearch;
