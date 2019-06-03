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
        <SearchConsumer uses={({ searchTerm }) => ({ searchTerm })}>
          {({ searchTerm }) => <div>{searchTerm}</div>}
        </SearchConsumer>
      </SearchProvider>
    );
    expect(wrapper.text()).toEqual("test");
  });

  it("supports a 'uses' parameter", () => {
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
        <SearchConsumer uses={({ resultsPerPage }) => ({ resultsPerPage })}>
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
