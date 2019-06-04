import React from "react";
import withSearch from "./withSearch";
import PropTypes from "prop-types";

function WithSearch({ mapContextToProps, children }) {
  const Search = withSearch(mapContextToProps)(props => {
    return children(props);
  });

  return <Search />;
}

WithSearch.propTypes = {
  mapContextToProps: PropTypes.func,
  children: PropTypes.func.isRequired
};

export default WithSearch;
