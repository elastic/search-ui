import React from "react";
import withSearch from "./withSearch";
import PropTypes from "prop-types";

function SearchConsumer(props) {
  const Search = withSearch(props.with, searchProps => {
    return props.children(searchProps);
  });

  return <Search />;
}

SearchConsumer.propTypes = {
  with: PropTypes.array,
  children: PropTypes.func.isRequired
};

export default SearchConsumer;
