import type { QueryConfig, RequestState } from "@elastic/search-ui";
import { BaseQueryBuilder } from "./BaseQueryBuilder";
import {
  transformFacet,
  transformFacetToAggs,
  transformFilter
} from "../transformer/filterTransformer";
import { SearchRequest } from "../types";
import { getQueryFields } from "../utils";

export class SearchQueryBuilder extends BaseQueryBuilder {
  constructor(state: RequestState, private readonly queryConfig: QueryConfig) {
    super(state);
  }

  build() {
    this.setPagination(this.state.current, this.state.resultsPerPage);
    this.setSourceFields(Object.keys(this.queryConfig.result_fields));
    this.setSort(this.buildSort());
    this.setHighlight(this.buildHighlight());
    this.setAggregations(this.buildAggregations());
    this.setPostFilter(this.buildPostFilter());
    this.setQuery(this.buildQuery());

    return this.query;
  }

  private buildSort(): SearchRequest["sort"] {
    if (this.state.sortList?.length) {
      return this.state.sortList
        .filter((s) => s.direction)
        .map(({ field, direction }) => ({
          [field]: direction || "desc"
        }));
    }

    if (this.state.sortField && this.state.sortDirection) {
      return { [this.state.sortField]: this.state.sortDirection };
    }

    return "_score";
  }

  private buildHighlight() {
    const highlightFields = Object.entries(
      this.queryConfig.result_fields
    ).reduce((acc, [fieldKey, fieldConfiguration]) => {
      if (fieldConfiguration.snippet) {
        acc[fieldKey] = {};
      }
      return acc;
    }, {});

    return Object.keys(highlightFields).length > 0
      ? { fields: highlightFields }
      : null;
  }

  private buildAggregations() {
    if (
      !this.queryConfig.facets ||
      !Object.keys(this.queryConfig.facets).length
    ) {
      return null;
    }

    const hasSelectedFilters = this.state.filters?.some(
      (selectedFilter) =>
        !this.queryConfig.filters?.find(
          (baseFilter) => baseFilter.field === selectedFilter.field
        )
    );

    return Object.entries(this.queryConfig.facets).reduce(
      (acc, [facetKey, facetConfiguration]) => {
        const isDisjunctive =
          this.queryConfig.disjunctiveFacets?.includes(facetKey);
        if (isDisjunctive && hasSelectedFilters) {
          acc[`facet_bucket_${facetKey}`] = {
            aggs: {
              [facetKey]: transformFacetToAggs(facetKey, facetConfiguration)
            },
            filter: {
              bool: {
                must: this.state.filters
                  .filter((filter) => filter.field !== facetKey)
                  .map((filter) =>
                    transformFacet(
                      filter,
                      this.queryConfig.facets[filter.field],
                      this.queryConfig.disjunctiveFacets?.includes(filter.field)
                    )
                  )
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
              must:
                this.state.filters?.map((filter) =>
                  transformFacet(
                    filter,
                    this.queryConfig.facets[filter.field],
                    this.queryConfig.disjunctiveFacets?.includes(filter.field)
                  )
                ) || []
            }
          }
        }
      }
    );
  }

  private buildPostFilter() {
    const postFilter = this.state.filters
      ?.filter((filter) => this.queryConfig.facets[filter.field])
      .map((filter) =>
        transformFacet(
          filter,
          this.queryConfig.facets[filter.field],
          this.queryConfig.disjunctiveFacets?.includes(filter.field)
        )
      );

    return postFilter?.length ? { bool: { must: postFilter } } : null;
  }

  private buildQuery(): SearchRequest["query"] | null {
    const filters = [
      ...(this.state.filters || []),
      ...(this.queryConfig.filters || [])
    ].map(transformFilter);
    const searchQuery = this.state.searchTerm;

    if (!searchQuery && !filters?.length) {
      return null;
    }

    const fields = getQueryFields(this.queryConfig.search_fields);

    return {
      bool: {
        ...(filters?.length && { filter: filters }),
        ...(searchQuery && {
          must: [
            {
              bool: {
                minimum_should_match: 1,
                should: [
                  {
                    multi_match: {
                      query: searchQuery,
                      fields: fields,
                      type: "best_fields",
                      operator: "and"
                    }
                  },
                  {
                    multi_match: {
                      query: searchQuery,
                      fields: fields,
                      type: "cross_fields"
                    }
                  },
                  {
                    multi_match: {
                      query: searchQuery,
                      fields: fields,
                      type: "phrase"
                    }
                  },
                  {
                    multi_match: {
                      query: searchQuery,
                      fields: fields,
                      type: "phrase_prefix"
                    }
                  }
                ]
              }
            }
          ]
        })
      }
    };

    return {
      bool: {
        ...(filters?.length && { filter: filters }),
        ...(searchQuery
          ? {
              should: [
                {
                  multi_match: {
                    query: searchQuery,
                    fields: fields,
                    type: "best_fields",
                    operator: "and"
                  }
                },
                {
                  multi_match: {
                    query: searchQuery,
                    fields: fields,
                    type: "cross_fields"
                  }
                },
                {
                  multi_match: {
                    query: searchQuery,
                    fields: fields,
                    type: "phrase"
                  }
                },
                {
                  multi_match: {
                    query: searchQuery,
                    fields: fields,
                    type: "phrase_prefix"
                  }
                }
              ]
            }
          : {})
      }
    };
  }
}
