// create a simple react page with a list of regular a href links

import * as React from "react";
import Navigation from "./components/Navigation";
import ProductCarousel from "./components/ProductCarousel";
import "./styles.css";

export default function Ecommerce() {
  return (
    <>
      <Navigation />
      <div className="max-w-screen-xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <ProductCarousel
          title="Latest in TVs"
          filters={[{ field: "parent_category", values: ["TVs"] }]}
        />
        <ProductCarousel
          title="Popular Monitors"
          filters={[{ field: "parent_category", values: ["Monitors"] }]}
        />
      </div>
    </>
  );
}
