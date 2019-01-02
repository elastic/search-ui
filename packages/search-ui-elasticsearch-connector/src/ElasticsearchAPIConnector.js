import elasticsearch from "elasticsearch";
import { toResultList } from "./responseAdapters";

export default class ElasticsearchAPIConnector {
  constructor({ indexName, host }) {
    this.host = host;
    this.indexName = indexName;
    this.client = new elasticsearch.Client({
      host
    });
  }

  //eslint-disable-next-line
  click({ query, documentId, tags }) {
    //TODO
  }

  //eslint-disable-next-line
  search(searchTerm, searchOptions) {
    const query = searchTerm
      ? {
          multi_match: {
            query: searchTerm
          }
        }
      : { match_all: {} };

    return this.client
      .search({
        index: this.indexName,
        body: {
          query
        }
      })
      .then(body => toResultList(body));
  }
}
