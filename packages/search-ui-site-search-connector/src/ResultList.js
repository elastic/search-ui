"use strict";

import ResultItem from "./ResultItem";

// TODO This was copied from App Search api client, should probably have a
// specific type just for Search UI

/**
 * A list of ResultItems and additional information returned by a search request
 */
export default class ResultList {
  constructor(rawResults, rawInfo) {
    this.rawResults = rawResults;
    this.rawInfo = rawInfo;

    const results = new Array();
    rawResults.forEach(data => {
      results.push(new ResultItem(data));
    });

    this.results = results;
    this.info = rawInfo;
  }
}
