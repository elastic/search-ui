import { Facet, Filter } from "@elastic/search-ui/lib/esm/types";
import {
  addFilter,
  removeFilter,
  setFilter
} from "@elastic/search-ui/lib/esm/actions";

export type BaseContainerProps = {
  children?: React.ReactNode;
  className?: string;
};

export type BaseContainerStateProps = {
  error: string;
  filters: Filter[];
  facets: { [key: string]: Facet };
};

export type BaseContainerActionProps = {
  addFilter: typeof addFilter;
  removeFilter: typeof removeFilter;
  setFilter: typeof setFilter;
  a11yNotify: (...any: any[]) => void;
};

export type SearchDriverContext = BaseContainerActionProps &
  BaseContainerStateProps;

export type Rename<T, R extends
{ [K in keyof R]: K extends keyof T ? PropertyKey : "Error: key not in T" }
// eslint-disable-next-line prettier/prettier
> = { [P in keyof T as P extends keyof R ? R[P] : P]: T[P] }

export type SearchResult = Record<any, {
  raw: string | number | boolean
  snippet: string | number | boolean
}>
