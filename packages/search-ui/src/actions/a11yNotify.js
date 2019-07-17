import { announceToScreenReader } from "../A11yNotifications";

/**
 * Announces the current
 *
 * @param {string|func} -
 */
export default function a11y(message) {
  if (!this.a11yNotifications) return;
  if (this.debug) console.log("Action", "a11y", ...arguments); // eslint-disable-line no-console

  announceToScreenReader(message);
}
