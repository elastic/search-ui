import {
  FacetValue,
  FieldValue,
  FilterType,
  SearchContextState
} from "@elastic/search-ui";
import { BaseContainerProps } from "./types";

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
  filterType: FilterType;
  show?: number;
  view?: React.ComponentType<FacetViewProps>;
  isFilterable: boolean;
  field: string;
  label: string;
} & FacetContainerContext;
