import { setupDriver } from "../../test/helpers";

// Mock announceToScreenReader so that we can spy on it
jest.mock("../../A11yNotifications.js");
import { announceToScreenReader } from "../../A11yNotifications";

beforeEach(() => {
  jest.clearAllMocks();
});

describe("#a11yNotify", () => {
  const config = {
    a11yNotifications: true,
    a11yNotificationMessages: {
      customMessage: () => "Hello world"
    }
  };

  it("runs", () => {
    const { driver } = setupDriver(config);

    driver.a11yNotify("customMessage");
    expect(announceToScreenReader).toHaveBeenCalledWith("Hello world");
  });

  it("does not run if a11yNotifications has been turned off", () => {
    const { driver } = setupDriver({ ...config, a11yNotifications: false });

    driver.a11yNotify("customMessage");
    expect(announceToScreenReader).not.toHaveBeenCalled();
  });

  it("does not run if a valid a11yNotificationMessage function is not found", () => {
    const { driver } = setupDriver(config);

    driver.a11yNotify("invalid");
    expect(announceToScreenReader).not.toHaveBeenCalled();
  });

  it("logs expected debug messages", () => {
    jest.spyOn(global.console, "log").mockImplementation(); // Silence expected console logs
    const { driver } = setupDriver({ ...config, debug: true });

    driver.a11yNotify("customMessage", { foo: "bar" });
    expect(global.console.log).toHaveBeenCalledWith("Action", "a11yNotify", {
      messageFunc: "customMessage",
      messageArgs: { foo: "bar" },
      message: "Hello world"
    });

    driver.a11yNotify("invalid");
    expect(global.console.log).toHaveBeenCalledWith(
      "Action",
      "a11yNotify",
      'Could not find corresponding message function in "a11yNotificationMessages": invalid'
    );
  });
});
