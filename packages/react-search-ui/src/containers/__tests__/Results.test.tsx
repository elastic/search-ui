import React from "react";
import { render } from "@testing-library/react";
import ResultsContainer from "../Results";
import {
  ResultsViewProps,
  ResultViewProps
} from "@elastic/react-search-ui-views";
import { useSearch } from "../../hooks";

jest.mock("../../hooks", () => ({
  useSearch: jest.fn()
}));

const mockResults = [
  {
    id: {
      raw: "id",
      snippet: "<em>id</em>"
    },
    title: {
      raw: "title",
      snippet: "<em>title</em>"
    },
    url: {
      raw: "url",
      snippet: "<em>url</em>"
    }
  },
  {
    id: {
      raw: "id2",
      snippet: "<em>id</em>"
    },
    title: {
      raw: "title",
      snippet: "<em>title</em>"
    },
    url: {
      raw: "url",
      snippet: "<em>url</em>"
    }
  }
];

(useSearch as jest.Mock).mockReturnValue({ results: mockResults });

const params = {
  titleField: "title",
  urlField: "url"
};

it("supports a render prop", () => {
  const renderProp = ({ children }: ResultsViewProps) => {
    return <div>{children}</div>;
  };
  const { container } = render(
    <ResultsContainer {...params} view={renderProp} />
  );
  expect(container).toMatchSnapshot();
});

it("passes through props to individual Result items", () => {
  const resultView = ({ result }: ResultViewProps) => {
    return <li>{result.title.raw}</li>;
  };
  const { container } = render(
    <ResultsContainer
      {...params}
      resultView={resultView}
      shouldTrackClickThrough={true}
      clickThroughTags={["whatever"]}
    />
  );
  const resultItems = container.querySelectorAll("li");
  expect(resultItems).toHaveLength(2);
  resultItems.forEach((item) => {
    expect(item).toHaveTextContent("title");
  });
});

it("passes className through to the view", () => {
  let viewProps;
  const className = "test-class";
  render(
    <ResultsContainer
      {...params}
      className={className}
      view={(props) => {
        viewProps = props;
        return <div />;
      }}
    />
  );
  expect(viewProps.className).toEqual(className);
});

it("passes data-foo through to the view", () => {
  let viewProps;
  const data = "bar";
  render(
    <ResultsContainer
      {...params}
      data-foo={data}
      view={(props) => {
        viewProps = props;
        return <div />;
      }}
    />
  );
  expect(viewProps["data-foo"]).toEqual(data);
});
