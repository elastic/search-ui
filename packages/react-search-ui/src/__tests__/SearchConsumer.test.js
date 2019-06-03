import React from "react";
import { mount } from "enzyme";

import { SearchProvider, SearchConsumer } from "../..";

describe("SearchConsumer", () => {
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
        <SearchConsumer mapContextToProps={({ searchTerm }) => ({ searchTerm })}>
          {({ searchTerm }) => <div>{searchTerm}</div>}
        </SearchConsumer>
      </SearchProvider>
    );
    expect(wrapper.text()).toEqual("test");
  });

  it("supports a 'mapContextToProps' parameter", () => {
    const wrapper = mount(
      <SearchProvider
        config={{
          initialState: {
            resultsPerPage: 90,
            searchTerm: "test"
          },
          onSearch: () => {
            return {
              then: () => ({})
            };
          }
        }}
      >
        <SearchConsumer mapContextToProps={({ resultsPerPage }) => ({ resultsPerPage })}>
          {({ searchTerm, resultsPerPage }) => (
            <div>
              {searchTerm}
              {resultsPerPage}
            </div>
          )}
        </SearchConsumer>
      </SearchProvider>
    );
    expect(wrapper.text()).toEqual("90");
  });
});
