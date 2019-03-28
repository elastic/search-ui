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

it("renders correctly", () => {
  const wrapper = shallow(<ResultContainer {...params} />);
  expect(wrapper).toMatchSnapshot();
});

describe("link clicks", () => {
  it("will call back when a document link is clicked in the view", () => {
    const wrapper = shallow(<ResultContainer {...params} />);

    wrapper
      .find("Result")
      .at(0)
      .prop("onClickLink")();

    const [id] = params.trackClickThrough.mock.calls[0];
    expect(id).toEqual("id");
  });

  it("will not call back when shouldTrackClickThrough is false", () => {
    const wrapper = shallow(
      <ResultContainer {...params} shouldTrackClickThrough={false} />
    );

    wrapper
      .find("Result")
      .at(0)
      .prop("onClickLink")();

    expect(params.trackClickThrough.mock.calls.length).toEqual(0);
  });

  it("will pass through tags", () => {
    const wrapper = shallow(
      <ResultContainer {...params} clickThroughTags={["whatever"]} />
    );

    wrapper
      .find("Result")
      .at(0)
      .prop("onClickLink")();

    const [id, tags] = params.trackClickThrough.mock.calls[0];
    expect(id).toEqual("id");
    expect(tags).toEqual(["whatever"]);
  });
});

it("supports a render prop", () => {
  // eslint-disable-next-line react/prop-types
  const render = ({ children }) => {
    return <div>{children}</div>;
  };
  const wrapper = shallow(<ResultContainer {...params} view={render} />);
  expect(wrapper.find(render).dive()).toMatchSnapshot();
});
