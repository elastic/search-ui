/*
This spec mocks useState, so is split out into a separate file than
SearchProvider.test.js
*/

import React, { useState as useStateMock } from "react";

jest.mock("react", () => ({
  ...jest.requireActual("react"),
  useState: jest.fn()
}));

import { mount } from "enzyme";

import { SearchProvider } from "../..";

describe("SearchProvider", () => {
  const setState = jest.fn();

  beforeEach(() => {
    useStateMock.mockImplementation(init => [init, setState]);
  });

  function getDriverFromComponentState() {
    return setState.mock.calls[setState.mock.calls.length - 1][0];
  }

  describe("merges default and custom a11yNotificationMessages", () => {
    const getA11yNotificationMessages = a11yNotificationMessages => {
      mount(
        <SearchProvider config={{ a11yNotificationMessages }}>
          Test
        </SearchProvider>
      );
      return getDriverFromComponentState().a11yNotificationMessages;
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
