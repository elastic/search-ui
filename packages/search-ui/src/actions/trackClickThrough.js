/**
 * Report a click through event. A click through event is when a user
 * clicks on a result link.
 *
 * @param documentId String The document ID associated with result that was
 * clicked
 * @param tag Array[String] Optional Tags which can be used to categorize
 * this click event
 */
export default function trackClickThrough(documentId, tags = []) {
  if (this.debug)
    // eslint-disable-next-line no-console
    console.log("Search UI: Action", "trackClickThrough", ...arguments);

  const { requestId, searchTerm } = this.state;

  this.events.resultClick({
    query: searchTerm,
    documentId,
    requestId,
    tags
  });
}
