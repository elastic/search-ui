/*
# Overview
BeaconFacet is SignalFire's customization of the Facet component provided by ElasticSearch.

# Purpose
The customization allows for the following features:

  1) Negatable Facets - Each facet value can be negated which add a filter to the search query and
  excludes the negated facet value from the search results. To enable this feature, facet values
  for both the filter type specified as a parameter and filter type of "none" are passed to the
  children view. This is different from the original Facet component as it only passes 
  facet values for the single filter type specified as a parameter to the children view. The access
  to facet values for the "none" filter type allows the children view to display negatable 
  facet values with the correct selected state in addition to correctly displaying positive 
  facet values. Moreover, the component passes several filter state handlers to the children view 
  so that the children view can handle state updates to both positive and negatable facet values.
  (See `addFilter`, `removeFilter`, and `setFilter` in the code below.)

  2) Default Options - The component accepts default options as an optional parameter which can
  be used to display certain facet values. This is useful for curating or highlighting certain facet
  values for better use experience. The component can also be configured to either display or hide
  other facet values that are not in the default options list. If the component is configured to
  display other facet values, it will make sure to prevent displaying duplicate facet values that
  have already appeared in the default options list.

# Parameters
Only listing custom parameters introduced in addition to the ones from the original Facet component.
For the list of original parameters, see the original Facet component.
- @param {FacetValue[]} defaultOptions - The list of default options to display. If specified, the
  component will display the default options in the order specified in the lis
- @param {boolean} showDefaultOptionsOnly - Whether to display only the default options or not. If
  true, it will hide other facet values that are not in the default options list.

# Implementation Notes
The foundation of this component is the original Facet component provided by ElasticSearch and the
code is copied and pasted from that component as a starting point. Then, custom code was written
to implement the features described above. To keep up with the changes made to the original Facet
component in future releases, each release should be carefully reviewed and any corresponding
changes should also be made to this component.  
*/

import React from "react";
import { Component } from "react";
import {
  FacetContainerContext,
  BeaconFacetContainerProps,
  BeaconFacetViewProps,
  MultiCheckboxFacet,
  BeaconFacetValuesMapProps
} from "@elastic/react-search-ui-views";
import { FacetValue, helpers } from "@elastic/search-ui";
import {
  isMatchedFacetValueAndSearchTerm,
  isMatchedDefaultOptionAndSearchTerm,
  buildFacetValuesMap,
  stringifyFilterValue
} from "../helpers";
import { withSearch } from "..";

const { markSelectedFacetValuesFromFilters } = helpers;

type FacetContainerState = {
  searchTerm: string;
  more: number;
};

export class BeaconFacetContainer extends Component<
  BeaconFacetContainerProps,
  FacetContainerState
> {
  static defaultProps = {
    filterType: "all",
    isFilterable: false,
    show: 5
  };

  constructor(props) {
    super(props);
    this.state = {
      more: props.show,
      searchTerm: ""
    };
  }

  handleClickMore = (totalOptions) => {
    this.setState(({ more }) => {
      let visibleOptionsCount = more + 10;
      const showingAll = visibleOptionsCount >= totalOptions;
      if (showingAll) visibleOptionsCount = totalOptions;

      this.props.a11yNotify("moreFilters", { visibleOptionsCount, showingAll });

      return { more: visibleOptionsCount };
    });
  };

  handleFacetSearch = (searchTerm) => {
    this.setState({ searchTerm });
  };

  render() {
    const { more, searchTerm } = this.state;
    const {
      addFilter,
      className,
      facets,
      field,
      filterType,
      filters,
      label,
      removeFilter,
      setFilter,
      view,
      isFilterable,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      a11yNotify,
      defaultOptions: rawDefaultOptions,
      showDefaultOptionsOnly,
      ...rest
    } = this.props;
    const facetsForField = facets[field];

    if (!facetsForField) return null;

    // By using `[0]`, we are currently assuming only 1 facet per field. This will likely be enforced
    // in future version, so instead of an array, there will only be one facet allowed per field.
    const facet = facetsForField[0];

    // Build facetValuesMap for both the specified filterType and "none" filterType. This will
    // get passed to the children view so that the children view can display both positive and
    // negatable facet values.
    const facetValuesMap = {
      [filterType]: {},
      none: {}
    } as BeaconFacetValuesMapProps;

    [filterType, "none"].forEach((_filterType) => {
      const facetValues = markSelectedFacetValuesFromFilters(
        facet,
        filters,
        field,
        _filterType
      ).data;

      if (!facetValues.length) {
        facetValuesMap[_filterType][field] = {};
      } else {
        facetValuesMap[_filterType][field] = buildFacetValuesMap(facetValues);
      }
    });

    // Initialize facetValues for the specified filterType.
    let facetValues = Object.values(facetValuesMap[filterType][field]);

    // Initialize selectedValues
    const selectedValues = facetValues
      .filter((fv) => fv.selected)
      .map((fv) => fv.value);

    // Initialize defaultOptions
    let defaultOptions = rawDefaultOptions;

    // Return null early if there are no facetValues, selectedValues, and defaultOptions.
    if (
      !facetValues.length &&
      !selectedValues.length &&
      !defaultOptions?.length
    ) {
      return null;
    }

    // If searchTerm exists, filter down facetValues and defaultOptions.
    const searchTermTrimmed = searchTerm.trim();
    if (searchTermTrimmed) {
      // Filter down facetValues by searchTerm
      facetValues = facetValues.filter((facetValue: FacetValue) =>
        isMatchedFacetValueAndSearchTerm(facetValue, searchTermTrimmed)
      );

      // Filter down defaultOptions by searchTerm
      if (defaultOptions && defaultOptions.length) {
        const filteredDefaultOptions = [];
        defaultOptions.forEach((section) => {
          const sectionOptions = section.options.filter((option) =>
            isMatchedDefaultOptionAndSearchTerm(option, searchTerm)
          );
          if (sectionOptions && sectionOptions.length) {
            filteredDefaultOptions.push({
              ...section,
              options: sectionOptions
            });
          }
        });
        defaultOptions = filteredDefaultOptions;
      }
    }

    // Remove values that are already part of the default options from the other facet values to
    // prevent any duplicates.
    if (!showDefaultOptionsOnly && defaultOptions && defaultOptions.length) {
      const defaultOptionsSet = new Set(
        defaultOptions.flatMap((section) =>
          section.options.map((option) =>
            typeof option === "string" ? option : option.value
          )
        )
      );
      facetValues = facetValues.filter(
        (facetValue: FacetValue) =>
          !defaultOptionsSet.has(stringifyFilterValue(facetValue.value))
      );
    }

    const View: React.ComponentType<BeaconFacetViewProps> =
      view || MultiCheckboxFacet;

    const viewProps: BeaconFacetViewProps = {
      className,
      label: label,
      field,
      filterType,
      onMoreClick: this.handleClickMore.bind(this, facetValues.length),
      onRemove: (value) => {
        removeFilter(field, value, filterType);
      },
      onChange: (value) => {
        setFilter(field, value, filterType);
      },
      onSelect: (value) => {
        addFilter(field, value, filterType);
      },
      options: facetValues.slice(0, more),
      showMore: facetValues.length > more,
      values: selectedValues,
      showSearch: isFilterable,
      onSearch: (value) => {
        this.handleFacetSearch(value);
      },
      searchPlaceholder: `Filter ${label}`,
      searchTerm,
      addFilter,
      removeFilter,
      setFilter,
      defaultOptions,
      showDefaultOptionsOnly,
      facetValuesMap,
      ...rest
    };

    return <View {...viewProps} />;
  }
}

export default withSearch<BeaconFacetContainerProps, FacetContainerContext>(
  ({ filters, facets, addFilter, removeFilter, setFilter, a11yNotify }) => ({
    filters,
    facets,
    addFilter,
    removeFilter,
    setFilter,
    a11yNotify
  })
)(BeaconFacetContainer);
