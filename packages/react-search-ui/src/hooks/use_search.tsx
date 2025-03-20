import { createContext, useContext } from "react";

import type { SearchContextState } from "@elastic/search-ui";

export const SearchContextProvider = createContext<
  SearchContextState | undefined
>(undefined);

export const useSearch = () => {
  const context = useContext(SearchContextProvider);
  if (context === undefined) {
    throw new Error("useSearch must be used within a SearchContextProvider");
  }
  return context;
};

export default useSearch;
