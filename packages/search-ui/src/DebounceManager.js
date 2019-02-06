import debounceFn from "debounce-fn";

export default class DebounceManager {
  debounceCache = {};

  /*
  The purpose of this is to:
  Dynamically debounce and cache a debounced version of a function at the time of calling that function. This avoids
  managing debounced version of functions locally.

  Assumption:
  Functions are debounced on a combination of unique function and wait times. So debouncing won't work on
  subsequent calls with different wait times or different functions. That also means that the debounce manager
  can be used for different functions in parallel, and keep the two functions debounced separately.

  */
  runWithDebounce(wait, fn, ...parameters) {
    if (!wait) {
      return fn(...parameters);
    }

    const key = fn.toString() + wait.toString();
    let debounced = this.debounceCache[key];
    if (!debounced) {
      this.debounceCache[key] = debounceFn(fn, { wait });
      debounced = this.debounceCache[key];
    }
    debounced(...parameters);
  }
}
