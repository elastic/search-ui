// create a simple react page with a list of regular a href links

import * as React from "react";
import { Link } from "react-router-dom";

export default function Ecommerce() {
  return (
    <ul>
      <li>
        <Link to="/ecommerce/search">Search page</Link>
      </li>
      <li>
        <Link to="/ecommerce/category/tvs">Category page</Link>
      </li>
    </ul>
  );
}
