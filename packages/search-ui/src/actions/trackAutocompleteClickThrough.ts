import Events from "../Events";

/**
 * Report a click through event. A click through event is when a user
 * clicks on a result within an autocomplete Dropdown.
 *
 * @param documentId String The document ID associated with result that was
 * clicked
 * @param tag Array[String] Optional Tags which can be used to categorize
 * this click event
 */
export default function trackAutocompleteClickThrough(
  documentId: string,
  tags: string[] = []
): void {
  if (this.debug) {
    // eslint-disable-next-line no-console
    console.log(
      "Search UI: Action",
      "trackAutocompleteClickThrough",
      ...arguments
    );
  }

  const {
    autocompletedResultsRequestId,
    searchTerm,
    autocompletedResults,
    current,
    resultsPerPage,
    totalResults,
    filters
  } = this.state;
  const resultIndex = autocompletedResults.findIndex(
    (result) => result._meta.id === documentId
  );
  const result = autocompletedResults[resultIndex];

  const events: Events = this.events;

  events.autocompleteResultClick({
    query: searchTerm,
    documentId,
    requestId: autocompletedResultsRequestId,
    tags,
    result,
    resultIndex
  });

  events.emit({
    type: "ResultSelected",
    documentId,
    query: searchTerm,
    position: resultIndex,
    origin: "autocomplete",
    tags,
    totalResults,
    filters,
    currentPage: current,
    resultsPerPage: resultsPerPage
  });
}
