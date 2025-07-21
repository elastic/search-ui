import type { RequestState } from "@elastic/search-ui";
import { SearchRequest, SearchSourceFilter } from "../types";

export abstract class BaseQueryBuilder {
  protected query: SearchRequest = {
    size: 0,
    _source: {
      includes: []
    }
  };

  constructor(protected readonly state: RequestState) {}

  abstract build(): Promise<SearchRequest>;

  getSize(): number {
    return this.query.size || 0;
  }

  getFrom(): number {
    return this.query.from || 0;
  }

  getSearchTerm(): string {
    return this.state.searchTerm || "";
  }

  protected setPagination(
    current: number | undefined,
    size: number | undefined
  ): void {
    if (current && size) {
      this.query.from = (current - 1) * (size || 0);
      this.query.size = size;
    }
  }

  protected setSize(size: number): void {
    this.query.size = size;
  }

  protected setSourceFields(fields: string[] = []): void {
    (this.query._source as SearchSourceFilter).includes = fields;
  }

  protected setSort(sort: SearchRequest["sort"]): void {
    this.query.sort = sort;
  }

  /**
   * {@link https://www.elastic.co/guide/en/elasticsearch/reference/current/highlighting.html}
   */
  protected setHighlight(highlight: SearchRequest["highlight"] | null): void {
    if (highlight) {
      this.query.highlight = highlight;
    }
  }

  protected setAggregations(aggregations: SearchRequest["aggs"] | null): void {
    if (aggregations) {
      this.query.aggs = aggregations;
    }
  }

  protected setPostFilter(
    postFilter: SearchRequest["post_filter"] | null
  ): void {
    if (postFilter) {
      this.query.post_filter = postFilter;
    }
  }

  protected setQuery(query: SearchRequest["query"] | null): void {
    if (query) {
      this.query.query = query;
    }
  }
}
