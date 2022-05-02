import { Facet, Filter } from "@elastic/search-ui";

export type BaseContainerProps = {
  children?: React.ReactNode;
  className?: string;
};

export type BaseContainerStateProps = {
  error: string;
  filters: Filter[];
  facets: Record<string, Facet>;
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
