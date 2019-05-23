/*
 Check for object equality by doing shallow property comparisons.

 Alternate second parameter can scope the check to a subset of keys to compare.

 Returns "true" for equal, or a string if properties do not match, which
 can be useful for debugging. The string contains they mismatched key.
*/

export default function areEqualShallow(a, b, keys) {
  if (!a && !b) return true;
  if ((a && !b) || (b && !a)) return "";

  if (keys.length === 0) {
    for (let key in a) {
      if (!(key in b) || !Object.is(a[key], b[key])) {
        return key;
      }
    }
    for (let key in b) {
      if (!(key in a) || !Object.is(a[key], b[key])) {
        return key;
      }
    }
  } else {
    const mismatch = keys.find(key => !Object.is(a[key], b[key]));
    return mismatch || true;
  }
  return true;
}
