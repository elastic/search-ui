import React from "react";
import { shallow } from "enzyme";
import { ResultsContainer } from "../Results";

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
  // eslint-disable-next-line react/prop-types
  const render = ({ children }) => {
    return <div>{children}</div>;
  };
  const wrapper = shallow(<ResultsContainer {...params} view={render} />);
  expect(wrapper).toMatchSnapshot();
});

it("passes through props to individual Result items", () => {
  // eslint-disable-next-line react/prop-types
  const resultView = ({ title }) => {
    return <li>{title}</li>;
  };
  const wrapper = shallow(
    <ResultsContainer
      {...params}
      resultView={resultView}
      shouldTrackClickThrough={true}
      clickThroughTags={["whatever"]}
    />
  );
  expect(wrapper.find("WithSearch").map(n => n.props())).toEqual([
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
      view={props => (viewProps = props)}
    />
  );
  expect(viewProps.className).toEqual(className);
});

it("passes data-foo through to the view", () => {
  let viewProps;
  const data = "bar";
  shallow(
    <ResultsContainer
      {...params}
      data-foo={data}
      view={props => (viewProps = props)}
    />
  );
  expect(viewProps["data-foo"]).toEqual(data);
});
