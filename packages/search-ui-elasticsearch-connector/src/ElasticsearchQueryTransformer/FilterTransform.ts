import { QueryDslQueryContainer } from "@elastic/elasticsearch/lib/api/types";
import type {
  Filter,
  FilterValue,
  FilterValueRange,
  FilterType
} from "@elastic/search-ui";
import { isRangeFilter, isValidDateString } from "./utils";
import type { QueryDslRangeQuery } from "@elastic/elasticsearch/lib/api/types";

export type BaseFilter = Pick<QueryDslQueryContainer, "bool">;
export type BaseFilterValue = Pick<QueryDslQueryContainer, "term">;
export type BaseFilterValueRange = Pick<QueryDslQueryContainer, "range">;

const mapFilterTypeToBoolType: Record<
  FilterType,
  "should" | "filter" | "must_not"
> = {
  any: "should",
  all: "filter",
  none: "must_not"
};

const transformRangeFilterValue = (
  value: FilterValueRange
): QueryDslRangeQuery => ({
  ...("from" in value
    ? {
        from: isValidDateString(value.from) ? value.from : Number(value.from)
      }
    : {}),
  ...("to" in value
    ? {
        to: isValidDateString(value.to) ? value.to : Number(value.to)
      }
    : {})
});

export const buildBaseFilters = (baseFilters: Filter[]): BaseFilter[] =>
  (baseFilters || []).map<BaseFilter>((filter) => {
    const boolType = mapFilterTypeToBoolType[filter.type || "all"];

    return {
      bool: {
        [boolType]: filter.values.map<BaseFilterValue | BaseFilterValueRange>(
          (value: FilterValue) => {
            if (isRangeFilter(value)) {
              return {
                range: {
                  [filter.field]: transformRangeFilterValue(value)
                }
              };
            }

            return {
              term: {
                [filter.field]: value
              }
            };
          }
        )
      }
    };
  });
