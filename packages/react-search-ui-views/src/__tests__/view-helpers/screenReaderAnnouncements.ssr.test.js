/**
 * @jest-environment node
 */
import React from "react";
import { shallow } from "enzyme";
import { ScreenReaderStatus } from "../../view-helpers";

it("does not crash or create errors in server-side rendered apps", () => {
  shallow(
    <ScreenReaderStatus
      render={announceToScreenReader => {
        announceToScreenReader("Test");
        return null;
      }}
    />
  );
});
