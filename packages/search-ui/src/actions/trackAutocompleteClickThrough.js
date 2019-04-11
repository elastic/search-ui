/**
 * Report a click through event. A click through event is when a user
 * clicks on a result within an autocomplete Dropdown.
 *
 * @param documentId String The document ID associated with result that was
 * clicked
 * @param tag Array[String] Optional Tags which can be used to categorize
 * this click event
 */
export default function trackAutocompleteClickThrough(documentId, tags = []) {
  if (this.debug) {
    // eslint-disable-next-line no-console
    console.log("Action", "trackAutocompleteClickThrough", ...arguments);
  }

  const { autocompletedResultsRequestId, searchTerm } = this.state;

  this.apiConnector.autocompleteClick({
    query: searchTerm,
    documentId,
    requestId: autocompletedResultsRequestId,
    tags
  });
}
