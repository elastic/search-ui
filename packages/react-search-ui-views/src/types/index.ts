import type {
  FacetValue,
  FieldValue,
  FilterType,
  SearchContextState
} from "@elastic/search-ui";

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

export type FacetContainerContext = Pick<
  SearchContextState,
  | "addFilter"
  | "removeFilter"
  | "setFilter"
  | "a11yNotify"
  | "filters"
  | "facets"
>;

export type FacetContainerProps = BaseContainerProps & {
  filterType?: FilterType;
  show?: number;
  view?: React.ComponentType<FacetViewProps>;
  isFilterable?: boolean;
  field: string;
  label: string;
} & FacetContainerContext;

export type FacetDefaultOptionProps =
  | string
  | {
      label: string;
      value: string;
    };

export type FacetDefaultOptionsProps = {
  sectionName?: string;
  options: FacetDefaultOptionProps[];
};

export type BeaconFacetViewProps = FacetViewProps & {
  showDefaultOptionsOnly?: boolean;
  defaultOptions?: FacetDefaultOptionsProps[];
  searchTerm: string;
  addFilter: (
    filterType: FilterType,
    field: string,
    fieldValue: FieldValue
  ) => void;
  removeFilter: (
    filterType: FilterType,
    field: string,
    fieldValue: FieldValue
  ) => void;
  setFilter: (
    filterType: FilterType,
    field: string,
    fieldValue: FieldValue
  ) => void;
};

export type BeaconFacetContainerProps = Omit<FacetContainerProps, "view"> & {
  view?: React.ComponentType<BeaconFacetViewProps>;
  showDefaultOptionsOnly?: boolean;
  defaultOptions?: FacetDefaultOptionsProps[];
  otherOptionsSectionName?: string;
};

// BeaconFacetValuesMapProps is a nested hashmap of filterType -> field (string) -> stringified FacetValue (string) -> FacetValue.
// This is used to store the facet values in the BeaconFacetContainer.
export type BeaconFacetValuesMapProps = Record<
  FilterType,
  Record<string, Record<string, FacetValue>>
>;

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
