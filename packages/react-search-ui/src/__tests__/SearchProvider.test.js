import React from "react";
import { mount } from "enzyme";

import { SearchProvider, WithSearch } from "../..";

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
        <WithSearch
          mapContextToProps={({ searchTerm }) => ({ searchTerm })}
        >
          {({ searchTerm }) => <div>{searchTerm}</div>}
        </WithSearch>
      </SearchProvider>
    );
    expect(wrapper.text()).toEqual("test");
  });
});
