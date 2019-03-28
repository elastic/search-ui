import React from "react";
import { Autocomplete } from "..";
import { shallow } from "enzyme";

const props = {
  autocompleteResults: {
    sectionTitle: "Results",
    titleField: "title",
    urlField: "nps_link",
    linkTarget: "_blank"
  },
  autocompletedResults: [
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
    }
  ],
  autocompleteSuggestions: {
    documents: {
      sectionTitle: "Suggested"
    },
    popular_queries: {
      sectionTitle: "Popular"
    }
  },
  autocompletedSuggestions: {
    documents: [
      { highlight: "", suggestion: "bike" },
      { highlight: "", suggestion: "bike police" },
      { highlight: "", suggestion: "bike police go" }
    ],
    popular_queries: [
      {
        highlight: "",
        suggestion: "how do i know when my bike needs new tires?"
      },
      { highlight: "", suggestion: "what is a banana bike?" },
      { highlight: "", suggestion: "is it cool to ride a bike?" }
    ]
  },
  getItemProps: props => props,
  getMenuProps: props => props
};

it("renders correctly", () => {
  const wrapper = shallow(<Autocomplete {...props} />);
  expect(wrapper).toMatchSnapshot();
});
