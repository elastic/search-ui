import React from "react";
import { SearchProviderContextInterface } from "./SearchProvider";

const SearchContext =
  React.createContext<SearchProviderContextInterface | null>(null);

export default SearchContext;
