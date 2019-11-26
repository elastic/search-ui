import PropTypes from "prop-types";
import { Component } from "react";
import { MultiCheckboxFacet } from "@elastic/react-search-ui-views";
import { helpers } from "@elastic/search-ui";

import { Facet, Filter, FilterType } from "../types";
import { accentFold } from "../helpers";
import { withSearch } from "..";

const { markSelectedFacetValuesFromFilters } = helpers;

export class FacetContainer extends Component {
  static propTypes = {
    // Props
    className: PropTypes.string,
    field: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    filterType: FilterType,
    show: PropTypes.number,
    view: PropTypes.func,
    isFilterable: PropTypes.bool,
    // State
    filters: PropTypes.arrayOf(Filter).isRequired,
    facets: PropTypes.objectOf(PropTypes.arrayOf(Facet)).isRequired,
    // Actions
    addFilter: PropTypes.func.isRequired,
    removeFilter: PropTypes.func.isRequired,
    setFilter: PropTypes.func.isRequired,
    a11yNotify: PropTypes.func.isRequired
  };

  static defaultProps = {
    filterType: "all",
    isFilterable: false
  };

  constructor({ show = 5 }) {
    super();
    this.state = {
      more: show,
      searchTerm: ""
    };
  }

  handleClickMore = totalOptions => {
    this.setState(({ more }) => {
      let visibleOptionsCount = more + 10;
      const showingAll = visibleOptionsCount >= totalOptions;
      if (showingAll) visibleOptionsCount = totalOptions;

      this.props.a11yNotify("moreFilters", { visibleOptionsCount, showingAll });

      return { more: visibleOptionsCount };
    });
  };

  handleFacetSearch = searchTerm => {
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
      // eslint-disable-next-line no-unused-vars
      a11yNotify,
      ...rest
    } = this.props;
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
      .filter(fv => fv.selected)
      .map(fv => fv.value);

    if (!facetValues.length && !selectedValues.length) return null;

    if (searchTerm.trim()) {
      facetValues = facetValues.filter(option =>
        accentFold(option.value)
          .toLowerCase()
          .includes(accentFold(searchTerm).toLowerCase())
      );
    }

    const View = view || MultiCheckboxFacet;

    return View({
      className,
      label: label,
      onMoreClick: this.handleClickMore.bind(this, facetValues.length),
      onRemove: value => {
        removeFilter(field, value, filterType);
      },
      onChange: value => {
        setFilter(field, value, filterType);
      },
      onSelect: value => {
        addFilter(field, value, filterType);
      },
      options: facetValues.slice(0, more),
      showMore: facetValues.length > more,
      values: selectedValues,
      showSearch: isFilterable,
      onSearch: value => {
        this.handleFacetSearch(value);
      },
      searchPlaceholder: `Filter ${field}`,
      ...rest
    });
  }
}

export default withSearch(
  ({ filters, facets, addFilter, removeFilter, setFilter, a11yNotify }) => ({
    filters,
    facets,
    addFilter,
    removeFilter,
    setFilter,
    a11yNotify
  })
)(FacetContainer);
