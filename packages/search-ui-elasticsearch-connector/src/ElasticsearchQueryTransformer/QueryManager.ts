import type {
  Filter as SearchUIFilter,
  QueryConfig,
  RequestState
} from "@elastic/search-ui";
import {
  transformFacet,
  transformFacetToAggs,
  transformFilter
} from "./FilterTransform";
import { Sort, Query, Filter, HighlightFields } from "./types";
import { SearchRequest } from "../types";

export class QueryManager {
  private filters: Filter[];
  private sortBy: Sort;
  private searchTerm?: string;
  private searchQuery?: Query;
  private size: number;
  private from: number;
  private postFilter: Filter[];
  private sourceFields: string[];
  private highlightFields: HighlightFields;
  private aggregations: Record<string, any>;

  constructor(
    state: RequestState,
    queryConfig: QueryConfig,
    type: "search" | "autocomplete" = "search"
  ) {
    this.searchTerm = state.searchTerm;
    this.setSearchQuery(state.searchTerm, type, queryConfig);
    this.setFilters(state.filters, queryConfig.filters, queryConfig.facets);
    this.setPostFilter(
      state.filters,
      queryConfig.facets,
      queryConfig.disjunctiveFacets
    );
    this.setSortBy(state.sortList, state.sortField, state.sortDirection);
    this.setSize(state.resultsPerPage);
    this.setFrom(state.current);
    this.setSourceFields(queryConfig.result_fields);
    this.setHighlightFields(queryConfig.result_fields);
    this.setAggregations(
      state.filters,
      queryConfig.filters,
      queryConfig.facets,
      queryConfig.disjunctiveFacets
    );
  }

  getQuery(): SearchRequest {
    const query = this.searchQuery || (this.getFilters()?.length ? {} : null);

    if (this.getFilters()?.length) {
      if (query.bool) {
        Object.assign(query.bool, {
          filter: [].concat(query.bool.filter || [], this.getFilters())
        });
      } else {
        Object.assign(query, { bool: { filter: this.getFilters() } });
      }
    }

    return {
      from: this.getFrom(),
      sort: this.getSort(),
      size: this.getSize(),
      _source: {
        includes: this.sourceFields
      },
      ...(this.aggregations && { aggs: this.aggregations }),
      ...(this.highlightFields && { highlight: this.highlightFields }),
      ...(this.getPostFilter()?.length && {
        post_filter: { bool: { must: this.getPostFilter() } }
      }),
      ...(query && { query })
    };
  }

  getSearchQuery(): unknown {
    return this.searchQuery;
  }

  getSearchTerm(): string {
    return this.searchTerm;
  }

  setSearchQuery(
    query: string,
    type: "search" | "autocomplete",
    queryConfig: QueryConfig
  ): void {
    if (!query) {
      this.searchQuery = null;
      return;
    }

    const fields = Object.entries(queryConfig.search_fields).map(
      ([fieldKey, fieldConfiguration]) => {
        const weight = `^${fieldConfiguration.weight || 1}`;
        return fieldKey + weight;
      }
    );
    if (type === "search") {
      this.searchQuery = {
        bool: {
          should: [
            {
              multi_match: {
                query: query,
                fields: fields,
                type: "best_fields",
                operator: "and"
              }
            },
            {
              multi_match: {
                query: query,
                fields: fields,
                type: "cross_fields"
              }
            },
            {
              multi_match: {
                query: query,
                fields: fields,
                type: "phrase"
              }
            },
            {
              multi_match: {
                query: query,
                fields: fields,
                type: "phrase_prefix"
              }
            }
          ]
        }
      };
    } else if (type === "autocomplete") {
      this.searchQuery = {
        bool: {
          must: [
            {
              multi_match: {
                query: query,
                type: "bool_prefix",
                fields: fields
              }
            }
          ]
        }
      };
    }
  }

  setFilters(
    filters: SearchUIFilter[] = [],
    baseFilters: SearchUIFilter[] = [],
    facets: QueryConfig["facets"] = {}
  ): void {
    this.filters = [...(filters || []), ...(baseFilters || [])]
      .filter(
        (f) => !facets[f.field] //exclude all filters that are defined as facets
      )
      .map(transformFilter);
  }

  getFilters(): Filter[] {
    return this.filters;
  }

  setSourceFields(fields: QueryConfig["result_fields"]): void {
    this.sourceFields = Object.keys(fields);
  }

  setPostFilter(
    selectedFilters: SearchUIFilter[],
    facetsConfig: QueryConfig["facets"],
    disjunctiveFacets: string[]
  ): void {
    this.postFilter = selectedFilters
      .filter((filter) => facetsConfig[filter.field])
      .map((filter) =>
        transformFacet(
          filter,
          facetsConfig[filter.field],
          disjunctiveFacets?.includes(filter.field)
        )
      );
  }

  setAggregations(
    selectedFilters: SearchUIFilter[],
    baseFilters: SearchUIFilter[] = [],
    facetsConfig: QueryConfig["facets"] = {},
    disjunctiveFacets: string[]
  ): void {
    if (facetsConfig && Object.keys(facetsConfig).length > 0) {
      const hasSelectedFilters = selectedFilters.some(
        (selectedFilter) =>
          !baseFilters.find(
            (baseFilter) => baseFilter.field === selectedFilter.field
          )
      ); // check if post filters exists

      this.aggregations = Object.entries(facetsConfig).reduce(
        (acc, [facetKey, facetConfiguration]) => {
          const isDisjunctive = disjunctiveFacets?.includes(facetKey);
          if (isDisjunctive && hasSelectedFilters) {
            acc[`facet_bucket_${facetKey}`] = {
              aggs: {
                [facetKey]: transformFacetToAggs(facetKey, facetConfiguration)
              },
              filter: {
                bool: {
                  must: selectedFilters
                    .filter((filter) => filter.field !== facetKey)
                    .map((filter) =>
                      transformFacet(
                        filter,
                        facetsConfig[filter.field],
                        disjunctiveFacets?.includes(filter.field)
                      )
                    ) // exclude the current facet
                }
              }
            };
          } else {
            acc.facet_bucket_all.aggs = {
              ...acc.facet_bucket_all.aggs,
              [facetKey]: transformFacetToAggs(facetKey, facetConfiguration)
            };
          }
          return acc;
        },
        {
          facet_bucket_all: {
            aggs: {},
            filter: {
              bool: {
                must: selectedFilters.map((filter) =>
                  transformFacet(
                    filter,
                    facetsConfig[filter.field],
                    disjunctiveFacets?.includes(filter.field)
                  )
                )
              }
            }
          }
        }
      );
    }
  }

  getPostFilter(): Record<string, any> {
    return this.postFilter;
  }

  setSortBy(
    sortList: QueryConfig["sortList"],
    sortField: string | undefined | null,
    sortDirection: string | undefined | null
  ): void {
    let sortValue: any = "_score";

    if (sortList?.length) {
      sortValue = sortList.map((s) => ({
        [s.field]: s.direction
      }));
    } else if (sortField && sortDirection) {
      sortValue = { [sortField]: sortDirection };
    }

    this.sortBy = sortValue;
  }

  /**
   * {@link https://www.elastic.co/guide/en/elasticsearch/reference/current/highlighting.html}
   */
  setHighlightFields(fields: QueryConfig["result_fields"]): void {
    const highlightFieldsObject = Object.entries(fields).reduce(
      (acc, [fieldKey, fieldConfiguration]) => {
        // Add the field to the highlight fields if it has a snippet
        if (fieldConfiguration.snippet) {
          acc[fieldKey] = {};
        }
        return acc;
      },
      {}
    );

    this.highlightFields =
      Object.keys(highlightFieldsObject).length > 0
        ? { fields: highlightFieldsObject }
        : null;
  }

  getSort(): Sort {
    return this.sortBy;
  }

  setSize(resultsPerPage: number): void {
    this.size = resultsPerPage || 0;
  }

  getSize(): number {
    return this.size;
  }

  setFrom(currentPage: number): void {
    this.from = (currentPage - 1) * this.getSize() || 0;
  }

  getFrom(): number {
    return this.from;
  }
}
