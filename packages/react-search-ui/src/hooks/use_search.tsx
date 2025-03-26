import { useContext } from "react";

import SearchContext from "../SearchContext";

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error("useSearch must be used within a SearchContext");
  }
  return context;
};

export default useSearch;
