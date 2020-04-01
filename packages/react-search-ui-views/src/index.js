import React from "react";
import * as viewHelpers from "./view-helpers";

function withViewHelpers(Component) {
  return function WithViewHelpers(props) {
    return <Component {...props} viewHelpers={viewHelpers} />;
  };
}

import { default as AutocompleteComponent } from "./Autocomplete";
import { default as ErrorBoundaryComponent } from "./ErrorBoundary";
import { default as FacetsComponent } from "./Facets";
import { default as MultiCheckboxFacetComponent } from "./MultiCheckboxFacet";
import { default as BooleanFacetComponent } from "./BooleanFacet";
import { default as PagingComponent } from "./Paging";
import { default as PagingInfoComponent } from "./PagingInfo";
import { default as ResultComponent } from "./Result";
import { default as ResultsComponent } from "./Results";
import { default as ResultsPerPageComponent } from "./ResultsPerPage";
import { default as SearchBoxComponent } from "./SearchBox";
import { default as SingleSelectFacetComponent } from "./SingleSelectFacet";
import { default as SingleLinksFacetComponent } from "./SingleLinksFacet";
import { default as SortingComponent } from "./Sorting";

export const Autocomplete = withViewHelpers(AutocompleteComponent);
export const ErrorBoundary = withViewHelpers(ErrorBoundaryComponent);
export const Facets = withViewHelpers(FacetsComponent);
export const MultiCheckboxFacet = withViewHelpers(MultiCheckboxFacetComponent);
export const BooleanFacet = withViewHelpers(BooleanFacetComponent);
export const Paging = withViewHelpers(PagingComponent);
export const PagingInfo = withViewHelpers(PagingInfoComponent);
export const Result = withViewHelpers(ResultComponent);
export const Results = withViewHelpers(ResultsComponent);
export const ResultsPerPage = withViewHelpers(ResultsPerPageComponent);
export const SearchBox = withViewHelpers(SearchBoxComponent);
export const SingleSelectFacet = withViewHelpers(SingleSelectFacetComponent);
export const SingleLinksFacet = withViewHelpers(SingleLinksFacetComponent);
export const Sorting = withViewHelpers(SortingComponent);

export { Layout } from "./layouts";
