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
    setFilter: PropTypes.func.isRequired
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

  handleClickMore = () => {
    this.setState(({ more }) => ({
      more: more + 10
    }));
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
      isFilterable
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
      onMoreClick: this.handleClickMore,
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
      searchPlaceholder: `Filter ${field}`
    });
  }
}

export default withSearch(
  ({ filters, facets, addFilter, removeFilter, setFilter }) => ({
    filters,
    facets,
    addFilter,
    removeFilter,
    setFilter
  })
)(FacetContainer);
