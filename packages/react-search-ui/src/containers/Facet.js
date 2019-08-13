import PropTypes from "prop-types";
import { Component } from "react";
import { MultiCheckboxFacet } from "@elastic/react-search-ui-views";

import { Facet, Filter, FilterType } from "../types";
import { accentFold } from "../helpers";

import { withSearch } from "..";

function findFacetValueInFilters(name, filters, filterType) {
  const filter = filters.find(f => f.field === name && f.type === filterType);
  if (!filter) return;
  return filter.values;
}

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
    const facetValues = facets[field];

    if (!facetValues) return null;

    let options = facetValues[0].data;
    const selectedValues =
      findFacetValueInFilters(field, filters, filterType) || [];

    if (!options.length && !selectedValues.length) return null;

    if (searchTerm.trim()) {
      options = options.filter(option =>
        accentFold(option.value)
          .toLowerCase()
          .includes(accentFold(searchTerm).toLowerCase())
      );
    }

    const View = view || MultiCheckboxFacet;

    return View({
      className,
      label: label,
      onMoreClick: this.handleClickMore.bind(this, options.length),
      onRemove: value => {
        removeFilter(field, value, filterType);
      },
      onChange: value => {
        setFilter(field, value, filterType);
      },
      onSelect: value => {
        addFilter(field, value, filterType);
      },
      options: options.slice(0, more),
      showMore: options.length > more,
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
