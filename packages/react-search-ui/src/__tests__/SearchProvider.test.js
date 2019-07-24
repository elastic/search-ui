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

  describe("merges default and custom a11yNotificationMessages", () => {
    const getA11yNotificationMessages = a11yNotificationMessages => {
      const wrapper = mount(
        <SearchProvider config={{ a11yNotificationMessages }}>
          Test
        </SearchProvider>
      );
      return wrapper.state("driver").a11yNotificationMessages;
    };

    it("default messages", () => {
      const messages = getA11yNotificationMessages({});

      expect(messages.moreFilters({ visibleOptionsCount: 7 })).toEqual(
        "7 options shown."
      );
    });

    it("override messages", () => {
      const messages = getA11yNotificationMessages({
        moreFilters: () => "Example override"
      });

      expect(messages.moreFilters()).toEqual("Example override");
    });

    it("new messages", () => {
      const messages = getA11yNotificationMessages({
        customMessage: () => "Hello world"
      });

      expect(messages.customMessage()).toEqual("Hello world");
    });
  });
});
