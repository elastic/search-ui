/**
 * This helper creates a live region that announces the results of certain
 * actions (e.g. searching, paging, etc.), that are otherwise invisible
 * to screen reader users.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Live_Regions
 */
const regionId = "search-ui-screen-reader-announcements";

const getLiveRegion = () => {
  let region = document.getElementById(regionId);
  if (region) return region;

  region = document.createElement("div");
  region.id = regionId;
  region.setAttribute("role", "status");
  region.setAttribute("aria-live", "polite");

  /**
   * Visually-hidden CSS that's still available to screen readers.
   * We're avoiding putting this in a stylesheet to ensure that this
   * still works for users that opt for custom CSS instead of importing
   * Search UI's styles. We're also opting to use CSSOM instead of
   * inline styles to avoid Content Security Policy warnings.
   *
   * @see https://github.com/h5bp/html5-boilerplate/blob/v5.0.0/src/css/main.css#L126-L140
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
  const region = getLiveRegion();
  region.innerText = announcement;
};

/**
 * React render prop component
 *
 * Initializes the live region on load/mount, and sends
 * back the announceToScreenReader function
 */
const ScreenReaderStatus = ({ render }) => {
  getLiveRegion();
  return render(announceToScreenReader);
};

export default ScreenReaderStatus;
