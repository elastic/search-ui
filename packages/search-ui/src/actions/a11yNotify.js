import { announceToScreenReader } from "../A11yNotifications";

/**
 * Announces the current
 *
 * @param {string|func} -
 */
export default function a11yNotify(messageFunc, messageArgs) {
  if (!this.a11yNotifications) return;

  const getMessage = this.a11yNotificationMessages[messageFunc];

  if (!getMessage) {
    if (this.debug) {
      const errorMessage = `Could not find corresponding message function in "a11yNotificationMessages": ${messageFunc}`;
      console.log("Action", "a11yNotify", errorMessage); // eslint-disable-line no-console
    }
    return;
  }

  const message = getMessage(messageArgs);
  announceToScreenReader(message);

  if (this.debug) {
    console.log("Action", "a11yNotify", { ...arguments, message }); // eslint-disable-line no-console
  }
}
