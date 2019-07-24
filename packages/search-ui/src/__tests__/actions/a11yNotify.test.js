import { setupDriver } from "../../test/helpers";

// Mock announceToScreenReader so that we can spy on it
jest.mock("../../A11yNotifications.js");
import { announceToScreenReader } from "../../A11yNotifications";

beforeEach(() => {
  jest.clearAllMocks();
});

describe("#a11yNotify", () => {
  const config = {
    hasA11yNotifications: true,
    a11yNotificationMessages: {
      customMessage: () => "Hello world"
    }
  };

  it("runs", () => {
    const { driver } = setupDriver(config);

    driver.a11yNotify("customMessage");
    expect(announceToScreenReader).toHaveBeenCalledWith("Hello world");
  });

  it("does not run if hasA11yNotifications is false", () => {
    const { driver } = setupDriver({ ...config, hasA11yNotifications: false });

    driver.a11yNotify("customMessage");
    expect(announceToScreenReader).not.toHaveBeenCalled();
  });

  it("does not run if a valid a11yNotificationMessage function is not found", () => {
    const { driver } = setupDriver(config);

    driver.a11yNotify("invalid");
    expect(announceToScreenReader).not.toHaveBeenCalled();
  });

  it("logs expected console messages", () => {
    // Spy on and silence expected console messages
    jest.spyOn(global.console, "log").mockImplementation();
    jest.spyOn(global.console, "warn").mockImplementation();

    const { driver } = setupDriver({ ...config, debug: true });

    driver.a11yNotify("customMessage", { foo: "bar" });
    expect(global.console.log).toHaveBeenCalledWith("Action", "a11yNotify", {
      messageFunc: "customMessage",
      messageArgs: { foo: "bar" },
      message: "Hello world"
    });

    driver.a11yNotify("invalid");
    expect(global.console.warn).toHaveBeenCalledWith(
      "Action",
      "a11yNotify",
      'Could not find corresponding message function in a11yNotificationMessages: "invalid"'
    );
  });
});
