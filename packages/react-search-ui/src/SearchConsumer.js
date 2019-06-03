import React from "react";
import withSearch from "./withSearch";
import PropTypes from "prop-types";

function SearchConsumer({ mapContextToProps: mapContextToProps, children }) {
  const Search = withSearch(mapContextToProps)(props => {
    return children(props);
  });

  return <Search />;
}

SearchConsumer.propTypes = {
  mapContextToProps: PropTypes.func,
  children: PropTypes.func.isRequired
};

export default SearchConsumer;
