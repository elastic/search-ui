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
        <WithSearch mapContextToProps={({ searchTerm }) => ({ searchTerm })}>
          {({ searchTerm }) => <div>{searchTerm}</div>}
        </WithSearch>
      </SearchProvider>
    );
    expect(wrapper.text()).toEqual("test");
  });

  describe("mapContextToProps", () => {
    function setup(mapContextToProps) {
      return mount(
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
          <WithSearch mapContextToProps={mapContextToProps}>
            {({ searchTerm, resultsPerPage, setResultsPerPage }) => (
              <div>
                {searchTerm}
                {resultsPerPage}
                {setResultsPerPage && typeof setResultsPerPage}
              </div>
            )}
          </WithSearch>
        </SearchProvider>
      );
    }

    it("can inject state", () => {
      const mapContextToProps = ({ resultsPerPage }) => ({
        resultsPerPage
      });
      const wrapper = setup(mapContextToProps);
      expect(wrapper.text()).toEqual("90");
    });

    it("can inject actions", () => {
      const mapContextToProps = ({ setResultsPerPage }) => ({
        setResultsPerPage
      });
      const wrapper = setup(mapContextToProps);
      expect(wrapper.text()).toEqual("function");
    });
  });
});
