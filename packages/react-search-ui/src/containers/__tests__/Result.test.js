import React from "react";
import { shallow } from "enzyme";
import { ResultContainer } from "../Result";

const params = {
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
  trackClickThrough: jest.fn(),
  titleField: "title",
  urlField: "url"
};

beforeEach(() => {
  params.trackClickThrough = jest.fn();
});

describe("link clicks", () => {
  it("will call back when a document link is clicked in the view", () => {
    let viewProps;

    shallow(
      <ResultContainer {...params} view={props => (viewProps = props)} />
    );

    const { onClickLink } = viewProps;
    onClickLink();

    const [id] = params.trackClickThrough.mock.calls[0];
    expect(id).toEqual("id");
  });

  it("will not call back when shouldTrackClickThrough is false", () => {
    let viewProps;

    shallow(
      <ResultContainer
        {...params}
        shouldTrackClickThrough={false}
        view={props => (viewProps = props)}
      />
    );

    const { onClickLink } = viewProps;
    onClickLink();

    expect(params.trackClickThrough.mock.calls.length).toEqual(0);
  });

  it("will pass through tags", () => {
    let viewProps;

    shallow(
      <ResultContainer
        {...params}
        clickThroughTags={["whatever"]}
        view={props => (viewProps = props)}
      />
    );

    const { onClickLink } = viewProps;
    onClickLink();

    const [id, tags] = params.trackClickThrough.mock.calls[0];
    expect(id).toEqual("id");
    expect(tags).toEqual(["whatever"]);
  });
});

it("passes className through to the view", () => {
  let viewProps;
  const className = "test-class";
  shallow(
    <ResultContainer
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
    <ResultContainer
      {...params}
      data-foo={data}
      view={props => (viewProps = props)}
    />
  );
  expect(viewProps["data-foo"]).toEqual(data);
});

it("supports a render prop", () => {
  // eslint-disable-next-line react/prop-types
  const render = ({ children }) => {
    return <div>{children}</div>;
  };
  const wrapper = shallow(<ResultContainer {...params} view={render} />);
  expect(wrapper).toMatchSnapshot();
});
