import React from "react";
import { Layout } from "../..";
import { shallow } from "enzyme";

it("renders correctly", () => {
  const wrapper = shallow(
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
  expect(wrapper).toMatchSnapshot();
});

it("will accept children instead of bodyContent", () => {
  const wrapper = shallow(
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
  expect(wrapper).toMatchSnapshot();
});
