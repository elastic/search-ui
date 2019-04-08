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
  allAutocompletedItemsCount: 5,
  autocompletedSuggestionsCount: 2,
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

describe("When there are results", () => {
  it("will render results", () => {
    const wrapper = shallow(
      <Autocomplete
        {...props}
        autocompleteResults={true}
        autocompleteSuggestions={false}
      />
    );
    expect(wrapper.find(".sui-search-box__results-list li").length).toEqual(3);
  });

  it("will NOT render results if autocompleteResults is false", () => {
    const wrapper = shallow(
      <Autocomplete
        {...props}
        autocompleteResults={false}
        autocompleteSuggestions={false}
      />
    );
    expect(wrapper.find(".sui-search-box__results-list").length).toEqual(0);
  });

  it("will render a results section title if one is provided", () => {
    const wrapper = shallow(
      <Autocomplete
        {...props}
        autocompleteResults={{
          sectionTitle: "Results",
          titleField: "title",
          urlField: "nps_link",
          linkTarget: "_blank"
        }}
        autocompleteSuggestions={false}
      />
    );
    expect(wrapper.find(".sui-search-box__section-title").text()).toEqual(
      "Results"
    );
  });

  it("will NOT render a suggestion section title if none is provided", () => {
    const wrapper = shallow(
      <Autocomplete
        {...props}
        autocompleteResults={{
          titleField: "title",
          urlField: "nps_link",
          linkTarget: "_blank"
        }}
        autocompleteSuggestions={false}
      />
    );
    expect(wrapper.find(".sui-search-box__section-title").length).toEqual(0);
  });
});

describe("When there are no results", () => {
  it("will NOT render results", () => {
    const wrapper = shallow(
      <Autocomplete
        {...props}
        autocompletedResults={[]}
        autocompleteResults={true}
        autocompleteSuggestions={false}
      />
    );
    expect(wrapper.find(".sui-search-box__results-list").length).toEqual(0);
  });

  it("will NOT render a result section title", () => {
    const wrapper = shallow(
      <Autocomplete
        {...props}
        autocompletedResults={[]}
        autocompleteResults={{
          sectionTitle: "Results",
          titleField: "title",
          urlField: "nps_link",
          linkTarget: "_blank"
        }}
        autocompleteSuggestions={false}
      />
    );
    expect(wrapper.find(".sui-search-box__section-title").length).toEqual(0);
  });
});

describe("When there are suggestions", () => {
  it("will render suggestions", () => {
    const wrapper = shallow(
      <Autocomplete
        {...props}
        autocompleteResults={false}
        autocompleteSuggestions={true}
      />
    );
    expect(wrapper.find(".sui-search-box__suggestion-list li").length).toEqual(
      6
    );
  });

  it("will NOT render suggestions if autocompleteSuggestions is false", () => {
    const wrapper = shallow(
      <Autocomplete
        {...props}
        autocompleteResults={false}
        autocompleteSuggestions={false}
      />
    );
    expect(wrapper.find(".sui-search-box__suggestion-list").length).toEqual(0);
  });

  it("will render a suggestion section title if one is provided", () => {
    const wrapper = shallow(
      <Autocomplete
        {...props}
        autocompleteResults={false}
        autocompleteSuggestions={{
          documents: {
            sectionTitle: "Suggested"
          }
        }}
      />
    );
    expect(wrapper.find(".sui-search-box__section-title").text()).toEqual(
      "Suggested"
    );
  });

  it("will NOT render a suggestion section title if none is provided", () => {
    const wrapper = shallow(
      <Autocomplete
        {...props}
        autocompleteResults={false}
        autocompleteSuggestions={true}
      />
    );
    expect(wrapper.find(".sui-search-box__section-title").length).toEqual(0);
  });
});

describe("When there are no suggestions", () => {
  it("will NOT render suggestions", () => {
    const wrapper = shallow(
      <Autocomplete
        {...props}
        autocompleteResults={false}
        autocompletedSuggestions={{}}
        autocompleteSuggestions={true}
      />
    );
    expect(wrapper.find(".sui-search-box__suggestion-list").length).toEqual(0);
  });

  it("will NOT render a suggestion section title", () => {
    const wrapper = shallow(
      <Autocomplete
        {...props}
        autocompleteResults={false}
        autocompletedSuggestions={{}}
        autocompleteSuggestions={{
          documents: {
            sectionTitle: "Suggested"
          }
        }}
      />
    );
    expect(wrapper.find(".sui-search-box__section-title").length).toEqual(0);
  });
});
