import React from "react";

import { appendClassName } from "./view-helpers";

type FacetsProps = {
  children: React.ReactNode;
  className?: string;
} & React.HTMLAttributes<HTMLDivElement>;

function Facets({ children, className, ...rest }: FacetsProps) {
  return (
    <div
      className={appendClassName("sui-facet-container", className)}
      {...rest}
    >
      {children}
    </div>
  );
}

export default Facets;
