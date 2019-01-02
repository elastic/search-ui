import PropTypes from "prop-types";
import React from "react";

function SearchBox(props) {
  const { isFocused, inputProps, onChange, onSubmit, value } = props;
  const focusedClass = isFocused ? "focus" : "";

  return (
    <form className="sui-search-box" onSubmit={onSubmit}>
      <input
        className={`sui-search-box__text-input ${focusedClass}`}
        onChange={onChange}
        type="text"
        value={value}
        placeholder="Search your documents&#8230;"
        {...inputProps}
      />
      <input
        type="submit"
        value="Search"
        className="button sui-search-box__submit"
      />
    </form>
  );
}

SearchBox.propTypes = {
  onChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
  inputProps: PropTypes.object,
  isFocused: PropTypes.bool
};

export default SearchBox;
