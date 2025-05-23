import React from "react";
import { render } from "@testing-library/react";
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
    const renderProp = ({ error }) => {
      return <div>{error}</div>;
    };
    const { container } = render(
      <ErrorBoundaryContainer {...params} view={renderProp} />
    );
    expect(container).toMatchSnapshot();
  });

  it("passes className through to the view", () => {
    const className = "test-class";
    render(
      <ErrorBoundaryContainer
        {...params}
        className={className}
        view={viewComponent}
      />
    );
    expect(viewProps.className).toEqual(className);
  });

  it("passes data-foo through to the view", () => {
    const data = "bar";
    render(
      <ErrorBoundaryContainer
        {...params}
        data-foo={data}
        view={viewComponent}
      />
    );
    expect(viewProps["data-foo"]).toEqual(data);
  });
});
