import React from "react";
import { mount } from "enzyme";

import { SearchProvider, WithSearch } from "../..";

describe("WithSearch", () => {
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
        <WithSearch
          mapContextToProps={({ resultsPerPage }) => ({ resultsPerPage })}
        >
          {({ searchTerm, resultsPerPage }) => (
            <div>
              {searchTerm}
              {resultsPerPage}
            </div>
          )}
        </WithSearch>
      </SearchProvider>
    );
    expect(wrapper.text()).toEqual("90");
  });
});
