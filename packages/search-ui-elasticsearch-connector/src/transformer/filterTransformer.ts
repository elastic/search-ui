import type {
  Filter as SearchUIFilter,
  FilterValueRange as SearchUIFilterValueRange,
  FilterValue as SearchUIFilterValue,
  FilterType as SearchUIFilterType,
  FacetConfiguration
} from "@elastic/search-ui";
import { isRangeFilter, isValidDateString } from "../utils";
import type {
  Filter,
  FilterValue,
  FilterValueRange,
  QueryRangeValue
} from "../types";

const mapFilterTypeToBoolType: Record<
  SearchUIFilterType,
  "should" | "filter" | "must_not"
> = {
  any: "should",
  all: "filter",
  none: "must_not"
};

const transformRangeFilterValue = (
  value: SearchUIFilterValueRange
): QueryRangeValue => ({
  ...("from" in value
    ? {
        gte: isValidDateString(value.from) ? value.from : Number(value.from)
      }
    : {}),
  ...("to" in value
    ? {
        lte: isValidDateString(value.to) ? value.to : Number(value.to)
      }
    : {})
});

const transformFilterValue =
  (field: string) =>
  (value: SearchUIFilterValue): FilterValue | FilterValueRange => {
    if (isRangeFilter(value)) {
      return {
        range: {
          [field]: transformRangeFilterValue(value)
        }
      };
    }

    return {
      term: {
        [field]: value
      }
    };
  };

export const getBoolTypeByFilterType = (type: SearchUIFilter["type"] = "all") =>
  mapFilterTypeToBoolType[type];

export const transformFilter = (filter: SearchUIFilter): Filter => {
  const boolType = getBoolTypeByFilterType(filter.type);

  return {
    bool: {
      [boolType]: filter.values.map<FilterValue | FilterValueRange>(
        transformFilterValue(filter.field)
      )
    }
  };
};

export const transformFacet = (
  filter: SearchUIFilter,
  facetConfiguration: FacetConfiguration
): Filter => {
  const boolType = getBoolTypeByFilterType(filter.type);

  if (facetConfiguration.type === "value") {
    return transformFilter(filter);
  } else if (
    facetConfiguration.type === "range" &&
    !facetConfiguration.center
  ) {
    return {
      bool: {
        [boolType]: filter.values.map((value) => {
          const range = isRangeFilter(value)
            ? value
            : // Keep to be backward compatible with passing range name as a string and get from and to from facet configuration.
              // TODO: Remove this in future versions.
              facetConfiguration.ranges.find((range) =>
                typeof value === "object" && "name" in value
                  ? range.name === value.name
                  : range.name === value
              );

          return transformFilterValue(filter.field)(range);
        })
      }
    };
  } else if (facetConfiguration.type === "range" && facetConfiguration.center) {
    return {
      bool: {
        [boolType]: filter.values.map((value) => {
          const range = facetConfiguration.ranges.find(
            (range) => range.name === value
          );

          return {
            bool: {
              ...(range.from
                ? {
                    must_not: [
                      {
                        geo_distance: {
                          distance: range.from + facetConfiguration.unit,
                          [filter.field]: facetConfiguration.center
                        }
                      }
                    ]
                  }
                : {}),
              ...(range.to
                ? {
                    must: [
                      {
                        geo_distance: {
                          distance: range.to + facetConfiguration.unit,
                          [filter.field]: facetConfiguration.center
                        }
                      }
                    ]
                  }
                : {})
            }
          };
        })
      }
    };
  }
};

export const transformFacetToAggs = (
  facetKey: string,
  facetConfiguration: FacetConfiguration
) => {
  if (facetConfiguration.type === "value") {
    const orderMap = {
      count: { _count: "desc" },
      value: { _key: "asc" }
    };

    return {
      terms: {
        field: facetKey,
        size: facetConfiguration.size || 20,
        order: orderMap[facetConfiguration.sort || "count"]
      }
    };
  } else if (
    facetConfiguration.type === "range" &&
    !facetConfiguration.center
  ) {
    return {
      filters: {
        filters: facetConfiguration.ranges.reduce(
          (acc, range) => ({
            ...acc,
            [range.name]: transformFilterValue(facetKey)(range)
          }),
          {}
        )
      }
    };
  } else if (facetConfiguration.type === "range" && facetConfiguration.center) {
    return {
      geo_distance: {
        field: facetKey,
        origin: facetConfiguration.center,
        unit: facetConfiguration.unit,
        keyed: true,
        ranges: facetConfiguration.ranges.map((range) => ({
          key: range.name,
          ...(range.from && { from: Number(range.from) }),
          ...(range.to && { to: Number(range.to) })
        }))
      }
    };
  }

  return {};
};
