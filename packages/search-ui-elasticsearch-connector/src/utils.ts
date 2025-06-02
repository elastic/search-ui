import type {
  FilterValue,
  FilterValueRange,
  SearchFieldConfiguration
} from "@elastic/search-ui";
// A naive regex to match elastic date math expressions. Note is can match on invalid start dates like 2020-99-99T99:00:00||+1y/d
const elasticRelativeDateRegex =
  /^(?:now|\d{4}-\d{2}-\d{2}(?:T\d{2}:\d{2}:\d{2}(?:\.\d+)?Z?)?\|\|)(?:[+-]\d[yMwdhHms])?(?:\/[yMwdhHms])?$/;

export const isDateMathString = (dateString: string): boolean =>
  !!dateString.match(elasticRelativeDateRegex);

export const isValidDateString = (dateString: unknown): boolean =>
  typeof dateString === "string" &&
  (isDateMathString(dateString) || !isNaN(Date.parse(dateString)));

export const isRangeFilter = (
  filterValue: FilterValue
): filterValue is FilterValueRange =>
  typeof filterValue === "object" &&
  ("from" in filterValue || "to" in filterValue);

export const getQueryFields = (
  searchFields: Record<string, SearchFieldConfiguration> = {}
): string[] =>
  Object.entries(searchFields).map(
    ([fieldKey, fieldConfiguration]) =>
      `${fieldKey}^${fieldConfiguration.weight || 1}`
  );

const decodeBase64 = (str: string): string => {
  const decodedStr = decodeURIComponent(str);

  if (typeof window === "undefined") {
    // Node.js environment
    return Buffer.from(decodedStr, "base64").toString("utf-8");
  }
  // Browser environment
  return window.atob(decodedStr);
};

export const getHostFromCloud = (cloud: { id: string }): string => {
  const { id } = cloud;
  // the cloud id is `cluster-name:base64encodedurl`
  // the url is a string divided by two '$', the first is the cloud url
  // the second the elasticsearch instance, the third the kibana instance
  const cloudUrls = decodeBase64(id.split(":")[1]).split("$");
  return `https://${cloudUrls[1]}.${cloudUrls[0]}`;
};

export const deepMergeObjects = (
  target: Record<string, unknown> | null,
  source: Record<string, unknown> | null
): Record<string, unknown> | null => {
  if (!target && !source) {
    return null;
  }

  if (!target || Object.keys(target).length === 0) {
    return { ...source };
  }

  if (!source || Object.keys(source).length === 0) {
    return { ...target };
  }

  const result = { ...target };

  for (const key in source) {
    if (source[key] && typeof source[key] === "object") {
      if (Array.isArray(source[key])) {
        result[key] = [
          ...(Array.isArray(result[key]) ? (result[key] as unknown[]) : []),
          ...(source[key] as unknown[])
        ];
      } else {
        result[key] = deepMergeObjects(
          (result[key] as Record<string, unknown>) || {},
          source[key] as Record<string, unknown>
        );
      }
    } else {
      result[key] = source[key];
    }
  }

  return result;
};
