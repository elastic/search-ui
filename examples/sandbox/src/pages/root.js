import * as React from "react";
import { Link } from "react-router-dom";

export default function Root() {
  return (
    <>
      <p>See how Search UI works with different search APIs:</p>
      <ul>
        <li>
          <Link to="/elasticsearch">Elasticsearch</Link>
        </li>
        <li>
          <Link to="/elasticsearch-ecommerce">Elasticsearch E-Commerce</Link>
        </li>
        <li>
          <Link to="/app-search">Elastic App Search</Link>
        </li>
        <li>
          <Link to="/site-search">Elastic Site Search</Link>
        </li>
        <li>
          <Link to="/workplace-search">Elastic Workplace Search</Link>
        </li>
      </ul>

      <p>Or check out our examples:</p>
      <ul>
        <li>
          <Link to="/search-as-you-type">Search-as-you-type</Link>
        </li>
      </ul>
    </>
  );
}
