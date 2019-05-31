import React from "react";
import withSearch from "./withSearch";
import PropTypes from "prop-types";

function SearchConsumer({ uses, children }) {
  const Search = withSearch(uses)(props => {
    return children(props);
  });

  return <Search />;
}

SearchConsumer.propTypes = {
  uses: PropTypes.array,
  children: PropTypes.func.isRequired
};

export default SearchConsumer;
