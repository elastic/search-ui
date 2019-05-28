import React from "react";
import { mount } from "enzyme";

import { SearchProvider, SearchConsumer } from "../..";

describe("SearchProvider", () => {
  it("exposes state and actions to components", () => {
    const wrapper = mount(
      <SearchProvider
        config={{
          initialState: {
            searchTerm: "test"
          },
          onSearch: () => {
            return {
              then: () => ({})
            };
          }
        }}
      >
        <SearchConsumer>
          {({ searchTerm }) => <div>{searchTerm}</div>}
        </SearchConsumer>
      </SearchProvider>
    );
    expect(wrapper.text()).toEqual("test");
  });
});
