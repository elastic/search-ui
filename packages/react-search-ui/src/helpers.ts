import { FacetValue, FilterValue, FilterType } from "@elastic/search-ui";
import {
  FacetDefaultOptionProps,
  BeaconFacetValuesMapProps
} from "@elastic/react-search-ui-views";

// LÒpez => Lopez
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/normalize
export const accentFold = (str: any): string =>
  typeof str === "string"
    ? str.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    : "";

export function getValueToSearchFromFacetValue(facetValue: FacetValue): string {
  switch (typeof facetValue.value) {
    case "string":
      return accentFold(facetValue.value).toLowerCase();
    case "number":
      return facetValue.value.toString();
    case "object": {
      return "name" in facetValue.value
        ? accentFold(facetValue.value.name).toLowerCase()
        : "";
    }
    default:
      return "";
  }
}

export function isMatchedFacetValueAndSearchTerm(
  facetValue: FacetValue,
  searchTerm: string
) {
  const valueToSearch = getValueToSearchFromFacetValue(facetValue);
  return valueToSearch.includes(accentFold(searchTerm).toLowerCase());
}

export function isMatchedDefaultOptionAndSearchTerm(
  option: FacetDefaultOptionProps,
  searchTerm: string
) {
  const valueToSearch =
    typeof option === "string"
      ? accentFold(option).toLowerCase()
      : accentFold(option.value).toLowerCase();

  return valueToSearch.includes(accentFold(searchTerm).toLowerCase());
}

/* 
Stringify the filterValue which can be a string, number, boolean, object with a name property,
or an array of string, number, or boolean. This is helpful for building keys to be used in hashmaps
of facetValues.
*/
export const stringifyFilterValue = (filterValue: FilterValue): string => {
  if (typeof filterValue === "string") return filterValue;
  if (typeof filterValue === "number" || typeof filterValue === "boolean")
    return filterValue.toString();
  if (typeof filterValue === "object" && "name" in filterValue)
    return filterValue.name;
  return "";
};

/*
Retrieves the stored facetValue from the facetValueMap given that map and the required keys of
filterType, field, and filterValue.
*/
export const getFacetValueFromFacetValueMap = (
  facetValueMap: BeaconFacetValuesMapProps,
  filterType: FilterType,
  field: string,
  filterValue: FilterValue
): FacetValue => {
  const filterValueString = stringifyFilterValue(filterValue);
  return facetValueMap?.[filterType]?.[field]?.[filterValueString];
};

/**
 * Build a hashmap of facetValues keyed by their stringified value.
 */
export function buildFacetValuesMap(
  facetValues: FacetValue[]
): Record<string, FacetValue> {
  return facetValues.reduce((acc, facetValue) => {
    acc[stringifyFilterValue(facetValue.value)] = facetValue;
    return acc;
  }, {});
}
