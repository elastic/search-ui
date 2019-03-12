import React from "react";

import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";

import { SearchBox } from "../src";

const baseProps = {
  onChange: action("changed"),
  onSubmit: e => {
    e.preventDefault();
    action("submitted")();
  },
  value: ""
};

const autocompleteItems = [
  {
    title: "Results",
    items: [
      { id: "1", snippet: "<em>Bike</em> Cops", raw: "", value: "Bike Cops" },
      { id: "2", snippet: "<em>Biker</em> Gang", raw: "", value: "Biker Gang" },
      { id: "3", snippet: "<em>Biker</em> Bar", raw: "", value: "Biker Bar" },
      {
        id: "4",
        snippet: "Best <em>bikes</em> of 2010",
        raw: "",
        value: "Best bikes of 2010"
      },
      {
        id: "5",
        snippet: "<em>Bike</em> seats and accessories",
        raw: "",
        value: "Bike seats and accessories"
      }
    ]
  },
  {
    title: "Suggestions",
    items: [
      { id: "6", snippet: "", raw: "bike", value: "bike" },
      { id: "7", snippet: "", raw: "bike police", value: "bike police" },
      { id: "8", snippet: "", raw: "bike police go", value: "bike police go" },
      { id: "9", snippet: "", raw: "fast bikes", value: "fast bikes" },
      { id: "10", snippet: "", raw: "bike race", value: "bike race" }
    ]
  }
];

// This wrapper is here just to store "value" state somewhere, so
// that when you type in the SearchBox, specifically for autocomplete,
// something actually changes on the page.
class Wrapper extends React.Component {
  constructor() {
    super();
    this.state = {
      value: ""
    };
  }

  render() {
    return (
      <SearchBox
        autocomplete={true}
        autocompleteItems={autocompleteItems}
        value={this.state.value}
        onSelectAutocomplete={selection => {
          action("selectAutocomplete")(selection);
        }}
        onSubmit={e => {
          e.preventDefault();
          action("submitted")();
        }}
        onChange={value => {
          action("changed")();
          this.setState({
            value
          });
        }}
        {...this.props}
      />
    );
  }
}

storiesOf("SearchBox", module)
  .add("no value", () => <SearchBox {...baseProps} />)
  .add("with value", () => <SearchBox {...baseProps} value="value" />)
  .add("with focus", () => <SearchBox {...baseProps} isFocused={true} />)
  .add("with inputProps", () => (
    <SearchBox
      {...baseProps}
      inputProps={{ placeholder: "custom placeholder" }}
    />
  ))
  .add("with autocomplete", () => <Wrapper />);
