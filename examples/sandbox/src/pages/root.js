import * as React from "react";
import { Link } from "react-router-dom";

export default function Root() {
  return (
    <div className="px-4 py-4">
      <p className="font-semibold">
        See how Search UI works with different search APIs:
      </p>
      <ul className="list-disc list-inside text-blue-600 mb-4">
        <li>
          <Link to="/elasticsearch">Elasticsearch</Link>
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

      <p className="font-semibold">Check out our examples:</p>
      <ul className="list-disc list-inside text-blue-600 mb-4">
        <li>
          <Link to="/search-as-you-type">Search-as-you-type</Link>
        </li>
        <li>
          <Link to="/customizing-styles-and-html">
            Customizing styles and HTML
          </Link>
        </li>
        <li>
          <Link to="/search-bar-in-header">Search bar in header</Link>
        </li>
        <li>
          <Link to="/elasticsearch-with-analytics">
            Elasticsearch with analytics plugin
          </Link>
        </li>
      </ul>

      <p className="font-semibold">Explore use cases:</p>
      <ul className="list-disc list-inside text-blue-600 mb-4">
        <li>
          <Link to="/ecommerce">Ecommerce</Link>
        </li>
      </ul>
    </div>
  );
}
