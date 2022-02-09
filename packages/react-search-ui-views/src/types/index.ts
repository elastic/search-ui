export interface BaseContainerProps {
  children?: React.ReactNode;
  className?: string;
}

export type {
  ErrorBoundaryContainerContext,
  ErrorBoundaryViewProps
} from "../ErrorBoundary";

export type { SearchBoxAutocompleteViewProps } from "../Autocomplete";
export type {
  FacetContainerContext,
  FacetViewProps,
  FacetContainerProps
} from "../Facet";
export type {
  PagingViewProps,
  PagingContainerContext,
  PagingContainerProps
} from "../Paging";
export type {
  PagingInfoContainerProps,
  PagingInfoContainerContext,
  PagingInfoViewProps
} from "../PagingInfo";
export type {
  ResultsContainerContext,
  ResultsContainerProps,
  ResultsViewProps
} from "../Results";
export type {
  ResultContainerContext,
  ResultContainerProps,
  ResultViewProps
} from "../Result";
export type {
  ResultsPerPageContainerContext,
  ResultsPerPageContainerProps,
  ResultsPerPageViewProps
} from "../ResultsPerPage";
export type {
  SearchBoxContainerContext,
  SearchBoxContainerProps,
  SearchBoxViewProps
} from "../SearchBox";
export type { InputViewProps } from "../SearchInput";
export type {
  SortingContainerContext,
  SortingContainerProps,
  SortingViewProps
} from "../Sorting";

// From SO https://stackoverflow.com/a/59071783
// TS Utility to rename keys in a type
// Usage type x = Rename<{ renameMe: string }, { "renameMe": "newName" }>
// x === { newName: string }
export type Rename<
  T,
  R extends {
    [K in keyof R]: K extends keyof T ? PropertyKey : "Error: key not in T";
  }
  // eslint-disable-next-line prettier/prettier
> = { [P in keyof T as P extends keyof R ? R[P] : P]: T[P] };
