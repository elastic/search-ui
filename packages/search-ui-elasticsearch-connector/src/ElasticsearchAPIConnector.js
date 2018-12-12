import elasticsearch from "elasticsearch";
import { toResultList } from "./responseAdapters";

/*eslint-disable*/
export default class ElasticsearchAPIConnector {
  constructor({ indexName, host }) {
    this.host = host;
    this.indexName = indexName;
    this.client = new elasticsearch.Client({
      host
    });
  }

  click({ query, documentId, tags }) {
    //TODO
  }

  search(searchTerm, searchOptions) {
    //eslint-disable-line
    const query = searchTerm
      ? {
          multi_match: {
            query: searchTerm
            //fields: ["title", "description"]
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
