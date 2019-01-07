import PropTypes from "prop-types";
import { Component } from "react";

import { FacetDetail, Filter } from "../types";
import { withSearch } from "..";

function findFacetValueInFilters(name, filters) {
  const filter = filters.find(f => Object.keys(f)[0] === name);
  if (!filter) return;
  return Object.values(filter)[0];
}

export class FacetContainer extends Component {
  static propTypes = {
    // Props
    field: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    show: PropTypes.number,
    view: PropTypes.func.isRequired,
    // State
    filters: PropTypes.arrayOf(Filter).isRequired,
    facets: PropTypes.objectOf(FacetDetail).isRequired,
    // Actions
    addFilter: PropTypes.func.isRequired,
    removeFilter: PropTypes.func.isRequired,
    setFilter: PropTypes.func.isRequired
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
      filters,
      label,
      removeFilter,
      setFilter,
      view
    } = this.props;
    const facetValues = facets[field];
    if (!facetValues) return null;

    const options = facets[field][0].data;
    const selectedValues = findFacetValueInFilters(field, filters) || [];
    if (!options.length && !selectedValues.length) return null;

    return view({
      label: label,
      onMoreClick: this.handleClickMore,
      onRemove: value => {
        removeFilter(field, value);
      },
      onChange: value => {
        setFilter(field, value);
      },
      onSelect: value => {
        addFilter(field, value);
      },
      options: options.slice(0, more),
      showMore: options.length > more,
      values: selectedValues
    });
  }
}

export default withSearch(FacetContainer);
