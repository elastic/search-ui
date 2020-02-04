/**
 * minimal debounce function
 *
 * mostly for not spamming the server with requests when
 * searching with type ahead
 */
function debounce(func, wait) {
  let timeout;
  const debouncedFn = function() {
    const args = arguments;
    const later = () => {
      func.apply(null, args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
  debouncedFn.cancel = () => {
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }
  };
  return debouncedFn;
}

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
   * @param {number} wait Milliseconds to debounce. Executes immediately if falsey.
   * @param {function} fn Function to debounce
   * @param {function} functionName Name of function to debounce, used to create a unique key
   * @param {...any} parameters Parameters to pass to function
   */
  runWithDebounce(wait, functionName, fn, ...parameters) {
    if (!wait) {
      return fn(...parameters);
    }

    const key = `${functionName}|${wait.toString()}`;
    let debounced = this.debounceCache[key];
    if (!debounced) {
      this.debounceCache[key] = debounce(fn, wait);
      debounced = this.debounceCache[key];
    }
    debounced(...parameters);
  }

  /**
   * Cancels existing debounced function calls.
   *
   * This will cancel any debounced function call, regardless of the debounce length that was provided.
   *
   * For example, making the following series of calls will create multiple debounced functions, because
   * they are cached by a combination of unique name and debounce length.
   *
   * runWithDebounce(1000, "_updateSearchResults", this._updateSearchResults)
   * runWithDebounce(500, "_updateSearchResults", this._updateSearchResults)
   * runWithDebounce(1000, "_updateSearchResults", this._updateSearchResults)
   *
   * Calling the following will cancel all of those, if they have not yet executed:
   *
   * cancelByName("_updateSearchResults")
   *
   * @param {string} functionName The name of the function that was debounced. This needs to match exactly what was provided
   * when runWithDebounce was called originally.
   */
  cancelByName(functionName) {
    Object.entries(this.debounceCache)
      .filter(([cachedKey]) => cachedKey.startsWith(`${functionName}|`))
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
  return debounce(fn, wait);
};

export default DebounceManager;
