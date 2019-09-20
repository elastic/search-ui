import debounceFn from "debounce-fn";

class DebounceManager {
  debounceCache = {};

  /**
   * Dynamically debounce and cache a debounced version of a function at the time of calling that function. This avoids
   * managing debounced version of functions locally.
   *
   * In other words, debounce usually works by debouncing based on
   * referential identity of a function. This works by comparing provided function names.
   *
   * This also has the ability to short-circuit a debounce all-together, if no wait
   * time is provided.
   *
   * Assumption:
   * Functions are debounced on a combination of unique function name and wait times. So debouncing won't work on
   * subsequent calls with different wait times or different functions. That also means that the debounce manager
   * can be used for different functions in parallel, and keep the two functions debounced separately.
   *
   *
   * @param {number} wait Milliseconds to debounce. Executes immediately if falsey.
   * @param {function} fn Function to debounce
   * @param {function} functionName Name of function to debounce, used to create a unique key
   * @param  {...any} parameters Parameters to pass to function
   */
  runWithDebounce(wait, functionName, fn, ...parameters) {
    if (!wait) {
      return fn(...parameters);
    }

    const key = functionName + wait.toString();
    let debounced = this.debounceCache[key];
    if (!debounced) {
      this.debounceCache[key] = debounceFn(fn, { wait });
      debounced = this.debounceCache[key];
    }
    debounced(...parameters);
  }

  cancelByName(functionName) {
    Object.entries(this.debounceCache)
      .filter(([cachedKey]) => cachedKey.startsWith(functionName))
      // eslint-disable-next-line no-unused-vars
      .forEach(([_, cachedValue]) => cachedValue.cancel());
  }
}
/**
 * Perform a standard debounce
 *
 * @param {number} wait Milliseconds to debounce. Executes immediately if falsey.
 * @param {function} fn Function to debounce
 */
DebounceManager.debounce = (wait, fn) => {
  return debounceFn(fn, { wait });
};

export default DebounceManager;
