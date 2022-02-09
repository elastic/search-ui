import React from "react";
import { shallow } from "enzyme";
import { ResultsContainer } from "../Results";
import {
  ResultsViewProps,
  ResultViewProps
} from "@elastic/react-search-ui-views";

const params = {
  results: [
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
    }
  ],
  titleField: "title",
  urlField: "url"
};

it("supports a render prop", () => {
  const render = ({ children }: ResultsViewProps) => {
    return <div>{children}</div>;
  };
  const wrapper = shallow(
    <ResultsContainer {...params} view={render} />
  ).dive();
  expect(wrapper).toMatchSnapshot();
});

it("passes through props to individual Result items", () => {
  const resultView = ({ result }: ResultViewProps) => {
    return <li>{result.title}</li>;
  };
  const wrapper = shallow(
    <ResultsContainer
      {...params}
      resultView={resultView}
      shouldTrackClickThrough={true}
      clickThroughTags={["whatever"]}
    />
  ).dive();
  expect(wrapper.find("WithSearch").map((n) => n.props())).toEqual([
    {
      result: {
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
      titleField: "title",
      urlField: "url",
      shouldTrackClickThrough: true,
      clickThroughTags: ["whatever"],
      view: resultView
    },
    {
      result: {
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
      titleField: "title",
      urlField: "url",
      shouldTrackClickThrough: true,
      clickThroughTags: ["whatever"],
      view: resultView
    }
  ]);
});

it("passes className through to the view", () => {
  let viewProps;
  const className = "test-class";
  shallow(
    <ResultsContainer
      {...params}
      className={className}
      view={(props) => {
        viewProps = props;
        return <div />;
      }}
    />
  ).dive();
  expect(viewProps.className).toEqual(className);
});

it("passes data-foo through to the view", () => {
  let viewProps;
  const data = "bar";
  shallow(
    <ResultsContainer
      {...params}
      data-foo={data}
      view={(props) => {
        viewProps = props;
        return <div />;
      }}
    />
  ).dive();
  expect(viewProps["data-foo"]).toEqual(data);
});
