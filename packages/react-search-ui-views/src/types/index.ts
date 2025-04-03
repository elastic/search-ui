import type { FacetValue, FieldValue, FilterType } from "@elastic/search-ui";

export interface BaseContainerProps {
  children?: React.ReactNode;
  className?: string;
}

export type { ErrorBoundaryViewProps } from "../ErrorBoundary";

export type { SearchBoxAutocompleteViewProps } from "../Autocomplete";

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

export type { ResultsContainerProps, ResultsViewProps } from "../Results";

export type { ResultContainerProps, ResultViewProps } from "../Result";

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

export type { SortingContainerProps, SortingViewProps } from "../Sorting";

export type FacetViewProps = {
  className?: string;
  label: string;
  onMoreClick: () => void;
  onRemove: (value: FieldValue) => void;
  onChange: (value: FieldValue) => void;
  onSelect: (value: FieldValue) => void;
  options: FacetValue[];
  showMore: boolean;
  values: any;
  showSearch: boolean;
  onSearch: (value: string) => void;
  searchPlaceholder: string;
};

export type FacetContainerProps = BaseContainerProps & {
  filterType?: FilterType;
  show?: number;
  view?: React.ComponentType<FacetViewProps>;
  isFilterable?: boolean;
  field: string;
  label: string;
  persistent?: boolean;
};

// From SO https://stackoverflow.com/a/59071783
// TS Utility to rename keys in a type
// Usage type x = Rename<{ renameMe: string }, { "renameMe": "newName" }>
// x === { newName: string }
export type Rename<
  T,
  R extends {
    [K in keyof R]: K extends keyof T ? PropertyKey : "Error: key not in T";
  }
> = { [P in keyof T as P extends keyof R ? R[P] : P]: T[P] };
