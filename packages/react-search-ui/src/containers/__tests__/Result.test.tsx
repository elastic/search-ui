import React, { useState } from "react";
import { shallow } from "enzyme";
import { ResultContainer } from "../Result";
import { ResultViewProps } from "@elastic/react-search-ui-views";

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
    const View = (props) => {
      viewProps = props;
      return <div />;
    };

    shallow(<ResultContainer {...params} view={View} />).dive();

    const { onClickLink } = viewProps;
    onClickLink();

    const [id] = params.trackClickThrough.mock.calls[0];
    expect(id).toEqual("id");
  });

  it("will not call back when shouldTrackClickThrough is false", () => {
    let viewProps;
    const View = (props) => {
      viewProps = props;
      return <div />;
    };

    shallow(
      <ResultContainer
        {...params}
        shouldTrackClickThrough={false}
        view={View}
      />
    ).dive();

    const { onClickLink } = viewProps;
    onClickLink();

    expect(params.trackClickThrough.mock.calls.length).toEqual(0);
  });

  it("will pass through tags", () => {
    let viewProps;
    const View = (props) => {
      viewProps = props;
      return <div />;
    };

    shallow(
      <ResultContainer
        {...params}
        clickThroughTags={["whatever"]}
        view={View}
      />
    ).dive();

    const { onClickLink } = viewProps;
    onClickLink();

    const [id, tags] = params.trackClickThrough.mock.calls[0];
    expect(id).toEqual("id");
    expect(tags).toEqual(["whatever"]);
  });
});

it("passes className through to the view", () => {
  let viewProps;
  const View = (props) => {
    viewProps = props;
    return <div />;
  };
  const className = "test-class";
  shallow(
    <ResultContainer {...params} className={className} view={View} />
  ).dive();
  expect(viewProps.className).toEqual(className);
});

it("passes data-foo through to the view", () => {
  let viewProps;
  const View = (props) => {
    viewProps = props;
    return <div />;
  };
  const data = "bar";
  shallow(<ResultContainer {...params} data-foo={data} view={View} />).dive();
  expect(viewProps["data-foo"]).toEqual(data);
});

it("supports a render prop", () => {
  const render = ({ children }: ResultViewProps) => {
    return <div>{children}</div>;
  };
  const wrapper = shallow(<ResultContainer {...params} view={render} />).dive();
  expect(wrapper).toMatchSnapshot();
});

describe("hooks support", () => {
  const MyResultView = () => {
    const [state] = useState(0);
    return <div>{state}</div>;
  };

  it("should allow hook to be used within a custom view component", () => {
    expect(() => {
      shallow(<ResultContainer {...params} view={MyResultView} />);
    }).not.toThrow();

    const wrapper = shallow(
      <ResultContainer {...params} view={MyResultView} />
    ).dive();
    expect(wrapper.find("div").text()).toBe("0");
  });
});
