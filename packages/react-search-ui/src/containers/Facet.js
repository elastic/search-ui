import PropTypes from "prop-types";
import { Component } from "react";
import { MultiCheckboxFacet } from "@elastic/react-search-ui-views";

import { Facet, Filter, FilterType } from "../types";

import { withSearch } from "..";

function findFacetValueInFilters(name, filters, filterType) {
  const filter = filters.find(f => f.field === name && f.type === filterType);
  if (!filter) return;
  return filter.values;
}

export class FacetContainer extends Component {
  static propTypes = {
    // Props
    field: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    filterType: FilterType,
    show: PropTypes.number,
    view: PropTypes.func,
    // State
    filters: PropTypes.arrayOf(Filter).isRequired,
    facets: PropTypes.objectOf(PropTypes.arrayOf(Facet)).isRequired,
    // Actions
    addFilter: PropTypes.func.isRequired,
    removeFilter: PropTypes.func.isRequired,
    setFilter: PropTypes.func.isRequired
  };

  static defaultProps = {
    filterType: "all"
  };

  constructor({ show = 5 }) {
    super();
    this.state = {
      more: show
    };
  }

  handleClickMore = () => {
    this.setState(({ more }) => ({
      more: more + 10
    }));
  };

  render() {
    const { more } = this.state;
    const {
      addFilter,
      facets,
      field,
      filterType,
      filters,
      label,
      removeFilter,
      setFilter,
      view
    } = this.props;
    const facetValues = facets[field];
    if (!facetValues) return null;

    const options = facets[field][0].data;
    const selectedValues =
      findFacetValueInFilters(field, filters, filterType) || [];
    if (!options.length && !selectedValues.length) return null;

    const View = view || MultiCheckboxFacet;

    return View({
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
      values: selectedValues
    });
  }
}

export default withSearch(FacetContainer);
