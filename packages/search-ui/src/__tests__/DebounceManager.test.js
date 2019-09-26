import DebounceManager from "../DebounceManager";

describe("#runWithDebounce", () => {
  it("will run the provided function after the provided number of milliseconds", () => {
    const manager = new DebounceManager();
    const debounced = jest.fn();

    manager.runWithDebounce(1000, "debounced", debounced);

    jest.advanceTimersByTime(500);
    expect(debounced.mock.calls.length).toBe(0);
    jest.advanceTimersByTime(1001);
    expect(debounced.mock.calls.length).toBe(1);
  });

  it("will debounce the function", () => {
    const manager = new DebounceManager();
    const debounced = jest.fn();

    manager.runWithDebounce(1000, "debounced", debounced);

    jest.advanceTimersByTime(100);

    manager.runWithDebounce(1000, "debounced", debounced);

    expect(debounced).not.toHaveBeenCalled();
    jest.advanceTimersByTime(1001);
    expect(debounced.mock.calls.length).toBe(1);
  });

  it("will will debounce functions with different wait times separately", () => {
    const manager = new DebounceManager();
    const debounced = jest.fn();

    manager.runWithDebounce(1000, "debounced", debounced);

    manager.runWithDebounce(1000, "debounced", debounced);

    manager.runWithDebounce(1000, "debounced", debounced);

    manager.runWithDebounce(999, "debounced", debounced);

    expect(debounced).not.toHaveBeenCalled();
    jest.advanceTimersByTime(1001);
    expect(debounced.mock.calls.length).toBe(2);
  });

  it("will will debounce functions with different names separately", () => {
    const manager = new DebounceManager();
    const debounced = jest.fn();

    manager.runWithDebounce(1000, "debounced", debounced);

    manager.runWithDebounce(1000, "debounced", debounced);

    manager.runWithDebounce(1000, "different", debounced);

    manager.runWithDebounce(999, "debounced", debounced);

    expect(debounced).not.toHaveBeenCalled();
    jest.advanceTimersByTime(1001);
    expect(debounced.mock.calls.length).toBe(3);
  });
});

describe("#cancelByName", () => {
  it("cancels debouncing", () => {
    const manager = new DebounceManager();
    const debounced = jest.fn();

    manager.runWithDebounce(1000, "debounced", debounced);

    manager.cancelByName("debounced");
    jest.advanceTimersByTime(1001);
    expect(debounced.mock.calls.length).toBe(0);
  });

  it("cancels functions with different times, but not different names", () => {
    const manager = new DebounceManager();
    const debounced = jest.fn();

    manager.runWithDebounce(1000, "debounced", debounced);
    manager.runWithDebounce(500, "debounced", debounced);
    manager.runWithDebounce(1000, "different", debounced);
    manager.runWithDebounce(999, "much different", debounced);

    manager.cancelByName("debounced");
    jest.advanceTimersByTime(1001);
    expect(debounced.mock.calls.length).toBe(2);
  });
});
