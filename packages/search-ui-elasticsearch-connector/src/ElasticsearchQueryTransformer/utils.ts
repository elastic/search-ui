import type { FilterValue, FilterValueRange } from "@elastic/search-ui";

// A naive regex to match elastic date math expressions. Note is can match on invalid start dates like 2020-99-99T99:00:00||+1y/d
const elasticRelativeDateRegex =
  /^(?:now|\d{4}-\d{2}-\d{2}(?:T\d{2}:\d{2}:\d{2}(?:\.\d+)?Z?)?\|\|)(?:[+-]\d[yMwdhHms])?(?:\/[yMwdhHms])?$/;

export const isDateMathString = (dateString: string): boolean =>
  !!dateString.match(elasticRelativeDateRegex);

export const isValidDateString = (dateString: unknown): boolean =>
  typeof dateString === "string" &&
  (isDateMathString(dateString) || !isNaN(Date.parse(dateString)));

export function isRangeFilter(
  filterValue: FilterValue
): filterValue is FilterValueRange {
  return (
    typeof filterValue === "object" &&
    ("from" in filterValue || "to" in filterValue)
  );
}
