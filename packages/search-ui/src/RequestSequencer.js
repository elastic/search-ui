/*
  This deals with sequencing of our async requests. When a lot of requests are firing very close to one another
  and are running in parallel, what happens if they return out of order? It creates a race condition.

  For example, if I type the term "react" in the search box, two queries may be initiated, in parallel.

  1. query for "reac"
  2. query for "react"

  If the query for "react" actually returns **before** the query for "reac",
  we could end up looking at the results for "reac", despite having typed "react" in the search box.

  To deal with this, we keep track of a sequence.
  */
export default class RequestSequencer {
  requestSequence = 0;
  lastCompleted = 0;

  next() {
    return ++this.requestSequence;
  }

  isOldRequest(request) {
    return request < this.lastCompleted;
  }

  completed(request) {
    this.lastCompleted = request;
  }
}
