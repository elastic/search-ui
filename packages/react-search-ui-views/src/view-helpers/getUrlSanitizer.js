const VALID_PROTOCOLS = ["http:", "https:"];

/**
 *
 * @param {URL} URLParser URL interface provided by browser https://developer.mozilla.org/en-US/docs/Web/API/URL
 * @param {String} currentLocation String representation of the browser's current location
 */
export default function getUrlSanitizer(URLParser, currentLocation) {
  // This function is curried so that dependencies can be injected and don't need to be mocked in tests.
  return url => {
    let parsedUrl = {};

    try {
      // Attempts to parse a URL as relative
      parsedUrl = new URLParser(url, currentLocation);
      // eslint-disable-next-line no-empty
    } catch (e) {}

    return VALID_PROTOCOLS.includes(parsedUrl.protocol) ? url : "";
  };
}
