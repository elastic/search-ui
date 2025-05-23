import React from "react";
import withSearch from "./withSearch";
import type { SearchContextState } from "./withSearch";
interface WithSearchProps {
  mapContextToProps?: (
    context: SearchContextState
  ) => Partial<SearchContextState>;
  children: (props: Partial<SearchContextState>) => React.ReactNode;
}

function WithSearch({ mapContextToProps, children }: WithSearchProps) {
  const Search = withSearch(mapContextToProps)((props) => {
    return children(props);
  });

  return <Search />;
}

export default WithSearch;
