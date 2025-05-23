import React from "react";
import { render } from "@testing-library/react";
import { Layout } from "../..";

it("renders correctly", () => {
  const { container } = render(
    <Layout
      header={<div>Header</div>}
      sideContent={
        <div>
          <div>Side Content</div>
        </div>
      }
      bodyContent={<div>Body Content</div>}
      bodyHeader={<div>Body Header</div>}
      bodyFooter={<div>Body Footer</div>}
    />
  );
  expect(container).toMatchSnapshot();
});

it("will accept children instead of bodyContent", () => {
  const { container } = render(
    <Layout
      header={<div>Header</div>}
      sideContent={
        <div>
          <div>Side Content</div>
        </div>
      }
      bodyHeader={<div>Body Header</div>}
      bodyFooter={<div>Body Footer</div>}
    >
      <div>Body Content</div>
    </Layout>
  );
  expect(container).toMatchSnapshot();
});

it("renders with className prop applied", () => {
  const { container } = render(<Layout className="test-class" />);
  expect(container.firstChild).toHaveClass("test-class");
});
