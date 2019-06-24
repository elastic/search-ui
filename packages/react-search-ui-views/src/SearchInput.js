import PropTypes from "prop-types";
import React from "react";

function SearchInput({ getAutocomplete, getButtonProps, getInputProps }) {
  return (
    <>
      <div className="sui-search-box__wrapper">
        <input {...getInputProps()} />
        {getAutocomplete()}
      </div>
      <input {...getButtonProps()} />
    </>
  );
}

SearchInput.propTypes = {
  getAutocomplete: PropTypes.func.isRequired,
  getButtonProps: PropTypes.func.isRequired,
  getInputProps: PropTypes.func.isRequired
};

export default SearchInput;
