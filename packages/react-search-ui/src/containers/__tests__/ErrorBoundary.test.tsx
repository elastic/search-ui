import React from "react";
import { shallow } from "enzyme";
import { ErrorBoundaryViewProps } from "@elastic/react-search-ui-views";
import ErrorBoundaryContainer from "../ErrorBoundary";
import { useSearch } from "../../hooks";

jest.mock("../../hooks", () => ({
  useSearch: jest.fn()
}));

(useSearch as jest.Mock).mockReturnValue({
  error: "I am an error"
});

describe("Error Boundary", () => {
  const params = {
    children: <div>Child</div>
  };

  let viewProps;

  const viewComponent: React.FC<ErrorBoundaryViewProps> = (
    props: ErrorBoundaryViewProps
  ) => {
    viewProps = props;
    return <div />;
  };

  beforeEach(() => {
    viewProps = null;
  });

  it("supports a render prop", () => {
    const render = ({ error }) => {
      return <div>{error}</div>;
    };
    const wrapper = shallow(
      <ErrorBoundaryContainer {...params} view={render} />
    ).dive();
    expect(wrapper).toMatchSnapshot();
  });

  it("passes className through to the view", () => {
    const className = "test-class";
    shallow(
      <ErrorBoundaryContainer
        {...params}
        className={className}
        view={viewComponent}
      />
    ).dive();
    expect(viewProps.className).toEqual(className);
  });

  it("passes data-foo through to the view", () => {
    const data = "bar";
    shallow(
      <ErrorBoundaryContainer
        {...params}
        data-foo={data}
        view={viewComponent}
      />
    ).dive();
    expect(viewProps["data-foo"]).toEqual(data);
  });
});
