import PropTypes from "prop-types";
import React, { Component } from "react";
import { withSearch } from "..";
import { Facet, Facets } from "@elastic/react-search-components";

import { FacetDetail, Filter } from "../types";

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function findFacetValueInFilters(name, filters) {
  const filter = filters.find(f => Object.keys(f)[0] === name);
  if (!filter) return;
  return Object.values(filter)[0][0];
}

export class FacetsContainer extends Component {
  static propTypes = {
    addFilter: PropTypes.func.isRequired,
    filters: PropTypes.arrayOf(Filter).isRequired,
    facets: PropTypes.objectOf(FacetDetail).isRequired,
    removeFilter: PropTypes.func.isRequired
  };

  render() {
    const { addFilter, filters, facets, removeFilter } = this.props;
    const facetNames = Object.keys(facets);
    if (!facetNames.length) return null;

    return (
      <Facets>
        {facetNames.map(name => {
          const options = facets[name][0].data;
          const selectedValue = findFacetValueInFilters(name, filters);
          if (!options.length && !selectedValue) return null;

          return (
            <Facet
              key={name}
              name={capitalizeFirstLetter(name)}
              onRemove={({ clickEvent, value }) => {
                clickEvent.preventDefault();
                removeFilter(name, value);
              }}
              onSelect={({ clickEvent, value }) => {
                clickEvent.preventDefault();
                addFilter(name, value);
              }}
              options={options}
              value={selectedValue}
            />
          );
        })}
      </Facets>
    );
  }
}

export default withSearch(FacetsContainer);
