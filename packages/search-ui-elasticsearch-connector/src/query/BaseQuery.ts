import QueryManager from "../core/QueryManager";
import type { Query } from "../core/RequestBodyBuilder";

export interface BaseQuery {
  getFilter(queryManager: QueryManager): Query | null;
}
