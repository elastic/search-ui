import { Event, SearchResult, SearchState } from "..";
import Events from "../Events";

/**
 * Report a click through event. A click through event is when a user
 * clicks on a result link.
 *
 * @param documentId String The document ID associated with result that was
 * clicked
 * @param tag Array[String] Optional Tags which can be used to categorize
 * this click event
 */
export default function trackClickThrough(
  documentId: string,
  tags: string[] = []
): void {
  if (this.debug)
    // eslint-disable-next-line no-console
    console.log("Search UI: Action", "trackClickThrough", ...arguments);

  const {
    requestId,
    searchTerm,
    results,
    current,
    resultsPerPage,
    totalResults,
    filters
  }: SearchState = this.state;

  const resultIndexOnPage = results.findIndex(
    (result) => result._meta.id === documentId
  );
  const result = results[resultIndexOnPage];
  const events: Events = this.events;

  this.events.resultClick({
    query: searchTerm,
    documentId,
    requestId,
    tags,
    result,
    page: current,
    resultsPerPage,
    resultIndexOnPage
  });

  events.emit({
    type: "ResultSelected",
    documentId,
    query: searchTerm,
    origin: "results",
    position: resultIndexOnPage,
    tags,
    totalResults,
    filters,
    currentPage: current,
    resultsPerPage: resultsPerPage
  });
}
