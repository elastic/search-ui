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

const autocompletedResults = [
  {
    id: { raw: "1" },
    title: { snippet: "<em>Bike</em> Cops" }
  },
  {
    id: { raw: "2" },
    title: { snippet: "<em>Biker</em> Gang" }
  },
  {
    id: { raw: "3" },
    title: { snippet: "<em>Biker</em> Bar" }
  },
  {
    id: { raw: "4" },
    title: { snippet: "Best <em>bikes</em> of 2010" }
  },
  {
    id: { raw: "5" },
    title: { snippet: "<em>Bike</em> seats and accessories" }
  }
];

const autocompleteSuggestions = {
  documents: {
    sectionTitle: "Suggested Queries"
  },
  popular_queries: {
    sectionTitle: "Popular Queries"
  }
};

const autocompletedSuggestions = {
  documents: [
    { highlight: "", suggestion: "bike" },
    { highlight: "", suggestion: "bike police" },
    { highlight: "", suggestion: "bike police go" },
    { highlight: "", suggestion: "fast bikes" },
    { highlight: "", suggestion: "bike race" }
  ],
  popular_queries: [
    {
      highlight: "",
      suggestion: "how do i know when my bike needs new tires?"
    },
    { highlight: "", suggestion: "what is a banana bike?" },
    { highlight: "", suggestion: "is it cool to ride a bike?" },
    { highlight: "", suggestion: "when were bikes invented?" },
    { highlight: "", suggestion: "bike" }
  ]
};

const autocompleteProps = {
  useAutocomplete: true,
  autocompleteResults: {
    sectionTitle: "Results Section",
    titleField: "title",
    urlField: "nps_link"
  },
  autocompletedResults: autocompletedResults,
  autocompleteSuggestions: autocompleteSuggestions,
  autocompletedSuggestions: autocompletedSuggestions,
  onSelectAutocomplete: selection => {
    action("selectAutocomplete")(selection);
  }
};

// This wrapper is here just to store "value" state somewhere, so
// that when you type in the SearchBox, specifically for autocomplete,
// something actually changes on the page.
class Wrapper extends React.Component {
  constructor() {
    super();
    this.state = {
      value: "b"
    };
  }

  render() {
    return (
      <SearchBox
        {...autocompleteProps}
        value={this.state.value}
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
  .add("with autocomplete", () => <Wrapper />)
  .add("with autocomplete no section title", () => (
    <Wrapper
      autocompleteResults={{
        ...{ ...autocompleteProps.autocompleteResults, sectionTitle: "" }
      }}
      autocompleteSuggestions={{}}
    />
  ));
