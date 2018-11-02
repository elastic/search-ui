import PropTypes from "prop-types";
import React, { Component } from "react";
import { withSearch } from "..";
import { SearchBox } from "@elastic/react-search-components";

export class SearchBoxContainer extends Component {
  static propTypes = {
    searchTerm: PropTypes.string.isRequired,
    setSearchTerm: PropTypes.func.isRequired
  };

  state = {
    value: "",
    isFocused: false
  };

  constructor(props) {
    super();
    this.state.value = props.searchTerm;
  }

  handleFocus = e => {
    this.setState({
      isFocused: true
    });
  };

  handleBlur = e => {
    this.setState({
      isFocused: false
    });
  };

  handleSubmit = e => {
    const { setSearchTerm } = this.props;
    const { value } = this.state;

    e.preventDefault();
    setSearchTerm(value);
  };

  handleChange = e => {
    this.setState({
      value: e.currentTarget.value
    });
  };

  render() {
    const { isFocused, value } = this.state;
    const { inputProps } = this.props;

    return (
      <SearchBox
        isFocused={isFocused}
        onChange={this.handleChange}
        onSubmit={this.handleSubmit}
        value={value}
        inputProps={{
          onFocus: this.handleFocus,
          onBlur: this.handleBlur,
          ...inputProps
        }}
      />
    );
  }
}

export default withSearch(SearchBoxContainer);
