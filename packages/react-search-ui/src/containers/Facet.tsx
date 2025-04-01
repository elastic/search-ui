import {
  FacetContainerProps,
  FacetViewProps,
  MultiCheckboxFacet
} from "@elastic/react-search-ui-views";
import { helpers } from "@elastic/search-ui";
import React from "react";
import { useState } from "react";
import { accentFold } from "../helpers";
import { useSearch } from "../hooks";
const { markSelectedFacetValuesFromFilters } = helpers;

const FacetContainer = ({
  className,
  field,
  filterType = "all",
  label,
  view,
  isFilterable = false,
  show = 5,
  persistent = false,
  ...rest
}: FacetContainerProps) => {
  const { filters, facets, addFilter, removeFilter, setFilter, a11yNotify } =
    useSearch();

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [more, setMore] = useState<number>(show);

  const handleClickMore = (totalOptions: number) => {
    let visibleOptionsCount = more + 10;
    const showingAll = visibleOptionsCount >= totalOptions;
    if (showingAll) visibleOptionsCount = totalOptions;

    a11yNotify("moreFilters", { visibleOptionsCount, showingAll });

    setMore(visibleOptionsCount);
  };

  const handleFacetSearch = (searchTerm: string) => {
    setSearchTerm(searchTerm);
  };
  const facetsForField = facets[field];
  if (!facetsForField) return null;

  // By using `[0]`, we are currently assuming only 1 facet per field. This will likely be enforced
  // in future version, so instead of an array, there will only be one facet allowed per field.
  const facet = facetsForField[0];
  let facetValues = markSelectedFacetValuesFromFilters(
    facet,
    filters,
    field,
    filterType
  ).data;
  const selectedValues = facetValues
    .filter((fv: any) => fv.selected)
    .map((fv: any) => fv.value);

  if (!facetValues.length && !selectedValues.length) return null;

  if (searchTerm.trim()) {
    facetValues = facetValues.filter((option) => {
      let valueToSearch: string;
      switch (typeof option.value) {
        case "string":
          valueToSearch = accentFold(option.value).toLowerCase();
          break;
        case "number":
          valueToSearch = option.value.toString();
          break;
        case "object":
          valueToSearch =
            typeof option?.value?.name === "string"
              ? accentFold(option.value.name).toLowerCase()
              : "";
          break;

        default:
          valueToSearch = "";
          break;
      }
      return valueToSearch.includes(accentFold(searchTerm).toLowerCase());
    });
  }
  const View: React.ComponentType<FacetViewProps> = view || MultiCheckboxFacet;
  const viewProps: FacetViewProps = {
    className,
    label: label,
    onMoreClick: handleClickMore.bind(this, facetValues.length),
    onRemove: (value) => {
      removeFilter(field, value, filterType);
    },
    onChange: (value) => {
      setFilter(field, value, filterType, persistent);
    },
    onSelect: (value) => {
      addFilter(field, value, filterType, persistent);
    },
    options: facetValues.slice(0, more),
    showMore: facetValues.length > more,
    values: selectedValues,
    showSearch: isFilterable,
    onSearch: (value) => {
      handleFacetSearch(value);
    },
    searchPlaceholder: `Filter ${label}`,
    ...rest
  };

  return <View {...viewProps} />;
};

export default FacetContainer;
