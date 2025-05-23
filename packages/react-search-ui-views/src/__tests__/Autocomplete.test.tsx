import React from "react";
import { render, screen } from "@testing-library/react";
import { Autocomplete } from "..";
import type { AutocompletedSuggestions } from "@elastic/search-ui";

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
      sectionTitle: "Popular",
      queryType: "results" as const,
      displayField: "query"
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
        result: {
          query: {
            raw: "bike police"
          }
        },
        queryType: "results" as const
      }
    ]
  } as AutocompletedSuggestions,
  getItemProps: (props) => props,
  getMenuProps: (props) => props
};

describe("Autocomplete", () => {
  it("renders correctly", () => {
    const { container } = render(<Autocomplete {...props} />);
    expect(container).toMatchSnapshot();
  });

  describe("When there are results", () => {
    it("will render results", () => {
      render(
        <Autocomplete
          {...props}
          autocompleteResults={true}
          autocompleteSuggestions={false}
        />
      );
      const results = screen.getAllByRole("listitem");
      expect(results).toHaveLength(3);
    });

    it("will NOT render results if autocompleteResults is false", () => {
      render(
        <Autocomplete
          {...props}
          autocompleteResults={false}
          autocompleteSuggestions={false}
        />
      );
      expect(screen.queryByRole("list")).not.toBeInTheDocument();
    });

    it("will render a results section title if one is provided", () => {
      render(
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
      expect(screen.getByText("Results")).toBeInTheDocument();
    });

    it("will NOT render a suggestion section title if none is provided", () => {
      render(
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
      expect(screen.queryByRole("heading")).not.toBeInTheDocument();
    });
  });

  describe("When there are no results", () => {
    it("will NOT render results", () => {
      render(
        <Autocomplete
          {...props}
          autocompletedResults={[]}
          autocompleteResults={true}
          autocompleteSuggestions={false}
        />
      );
      expect(screen.queryByRole("list")).not.toBeInTheDocument();
    });

    it("will NOT render a result section title", () => {
      render(
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
      expect(screen.queryByRole("heading")).not.toBeInTheDocument();
    });
  });

  describe("When there are suggestions", () => {
    it("will render suggestions", () => {
      render(
        <Autocomplete
          {...props}
          autocompleteResults={false}
          autocompleteSuggestions={true}
        />
      );
      const suggestions = screen.getAllByRole("listitem");
      expect(suggestions).toHaveLength(4);
    });

    it("will NOT render suggestions if autocompleteSuggestions is false", () => {
      render(
        <Autocomplete
          {...props}
          autocompleteResults={false}
          autocompleteSuggestions={false}
        />
      );
      expect(screen.queryByRole("list")).not.toBeInTheDocument();
    });

    it("will render a suggestion section title if one is provided", () => {
      render(
        <Autocomplete
          {...props}
          autocompleteResults={false}
          autocompleteSuggestions={{
            documents: {
              sectionTitle: "Suggested"
            },
            popular_queries: {
              queryType: "results",
              displayField: "query"
            }
          }}
        />
      );
      expect(screen.getByText("Suggested")).toBeInTheDocument();
    });

    it("will render a suggestion section title for all suggestion types if one is provided without a suggestion type", () => {
      render(
        <Autocomplete
          {...props}
          autocompleteResults={false}
          autocompleteSuggestions={{
            sectionTitle: "Suggested"
          }}
        />
      );
      const titles = screen.getAllByText("Suggested");
      expect(titles).toHaveLength(2);
    });

    it("will NOT render a suggestion section title if none is provided", () => {
      render(
        <Autocomplete
          {...props}
          autocompleteResults={false}
          autocompleteSuggestions={true}
        />
      );
      expect(screen.queryByRole("heading")).not.toBeInTheDocument();
    });
  });

  describe("When there are no suggestions", () => {
    it("will NOT render suggestions", () => {
      render(
        <Autocomplete
          {...props}
          autocompleteResults={false}
          autocompletedSuggestions={{}}
          autocompleteSuggestions={true}
        />
      );
      expect(screen.queryByRole("list")).not.toBeInTheDocument();
    });

    it("will NOT render a suggestion section title", () => {
      render(
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
      expect(screen.queryByRole("heading")).not.toBeInTheDocument();
    });
  });

  it("renders with className prop applied", () => {
    const customClassName = "test-class";
    const { container } = render(
      <Autocomplete className={customClassName} {...props} />
    );
    expect(container.firstChild).toHaveClass("test-class");
  });

  test("renders correctly when there is a malicious URL", () => {
    const customClassName = "test-class";
    const { container } = render(
      <Autocomplete className={customClassName} {...props} />
    );

    expect(container.firstChild).toHaveClass("test-class");
  });
});
