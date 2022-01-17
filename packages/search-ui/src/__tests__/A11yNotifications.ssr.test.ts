/**
 * @jest-environment node
 */
import { getLiveRegion, announceToScreenReader } from "../A11yNotifications";

it("does not crash or create errors in server-side rendered apps", () => {
  expect(getLiveRegion()).toBeUndefined();
  expect(announceToScreenReader()).toBeUndefined();
});
