import React from "react";
import { mount } from "enzyme";

import { SearchProvider, WithSearch } from "../..";

function getMockDriver() {
  return {
    tearDown: jest.fn(),
    setSearchQuery: jest.fn(),
    setAutocompleteQuery: jest.fn()
  };
}

describe("SearchProvider", () => {
  it("will mount even if no config is provided", () => {
    const wrapper = mount(
      <SearchProvider>
        <div></div>
      </SearchProvider>
    );
    expect(wrapper).toBeDefined();
  });

  it("will clean up searchDriver on unmount", () => {
    const driver = getMockDriver();
    const wrapper = mount(
      <SearchProvider driver={driver}>
        <div></div>
      </SearchProvider>
    );
    expect(driver.tearDown).not.toHaveBeenCalled();

    wrapper.unmount();
    expect(driver.tearDown).toHaveBeenCalled();
  });

  it("will update searchDriver when searchQuery config changes", () => {
    const originalSearchQueryConfig = {
      facets: { states: { type: "value", size: 30 } }
    };
    const updatedSearchQueryConfig = {};

    const driver = getMockDriver();
    const wrapper = mount(
      <SearchProvider
        driver={driver}
        config={{
          searchQuery: originalSearchQueryConfig
        }}
      >
        <div>test</div>
      </SearchProvider>
    );
    expect(driver.setSearchQuery).not.toHaveBeenCalled();

    wrapper.setProps({
      driver,
      config: { searchQuery: updatedSearchQueryConfig }
    });

    expect(driver.setSearchQuery).toHaveBeenCalledWith(
      updatedSearchQueryConfig
    );
    expect(driver.setAutocompleteQuery).not.toHaveBeenCalled();
  });

  it("will update searchDriver when autocompleteQuery config changes", () => {
    const autocompleteQueryConfig = {
      facets: { states: { type: "value", size: 30 } }
    };
    const updatedAutocompleteQueryConfig = {};

    const driver = getMockDriver();
    const wrapper = mount(
      <SearchProvider
        driver={driver}
        config={{
          autocompleteQuery: autocompleteQueryConfig
        }}
      >
        <div>test</div>
      </SearchProvider>
    );
    expect(driver.setAutocompleteQuery).not.toHaveBeenCalled();

    wrapper.setProps({
      driver,
      config: { autocompleteQuery: updatedAutocompleteQueryConfig }
    });

    expect(driver.setAutocompleteQuery).toHaveBeenCalledWith(
      updatedAutocompleteQueryConfig
    );
    expect(driver.setSearchQuery).not.toHaveBeenCalled();
  });

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
          mapContextToProps={({ searchTerm, setSearchTerm }) => ({
            searchTerm,
            setSearchTerm
          })}
        >
          {({ searchTerm, setSearchTerm }) => (
            <div>
              {searchTerm}
              {typeof setSearchTerm}
            </div>
          )}
        </WithSearch>
      </SearchProvider>
    );

    expect(wrapper.text()).toEqual("testfunction");
  });
});
