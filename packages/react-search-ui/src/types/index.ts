import { Facet, Filter } from "@elastic/search-ui";

export type BaseContainerProps = {
  children?: React.ReactNode;
  className?: string;
};

export type BaseContainerStateProps = {
  error: string;
  filters: Filter[];
  facets: { [key: string]: Facet };
};

export type Rename<
  T,
  R extends {
    [K in keyof R]: K extends keyof T ? PropertyKey : "Error: key not in T";
  }
  // eslint-disable-next-line prettier/prettier
> = { [P in keyof T as P extends keyof R ? R[P] : P]: T[P] }
