/**
 * This helper creates a live region that announces the results of certain
 * actions (e.g. searching, paging, etc.), that are otherwise invisible
 * to screen reader users.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Live_Regions
 */
const regionId = "search-ui-screen-reader-notifications";
const hasDOM = typeof document !== "undefined"; // Prevent errors in SSR apps

const getLiveRegion = () => {
  if (!hasDOM) return;

  let region = document.getElementById(regionId);
  if (region) return region;

  region = document.createElement("div");
  region.id = regionId;
  region.setAttribute("role", "status");
  region.setAttribute("aria-live", "polite");

  /**
   * Visually-hidden CSS that's still available to screen readers.
   * We're avoiding putting this in a stylesheet to ensure that this
   * still works for users that opt for custom views & CSS. We're
   * also opting to use CSSOM instead of inline styles to avoid
   * Content Security Policy warnings.
   *
   * @see https://accessibility.18f.gov/hidden-content/
   */
  region.style.position = "absolute";
  region.style.width = "1px";
  region.style.height = "1px";
  region.style.margin = "-1px";
  region.style.padding = "0";
  region.style.border = "0";
  region.style.overflow = "hidden";
  region.style.clip = "rect(0 0 0 0)";

  document.body.appendChild(region);
  return region;
};

const announceToScreenReader = announcement => {
  if (hasDOM) {
    const region = getLiveRegion();
    region.textContent = announcement;
  }
};

const defaultMessages = {
  searchResults: ({ start, end, totalResults, searchTerm }) => {
    let message = `Showing ${start} to ${end} results out of ${totalResults}`;
    if (searchTerm) message += `, searching for "${searchTerm}".`;
    return message;
  }
};

export { getLiveRegion, announceToScreenReader, defaultMessages };
