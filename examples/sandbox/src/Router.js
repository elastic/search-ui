import * as React from "react";
import { Routes, Route, Link } from "react-router-dom";
import "./App.css";
import App from "./App";
import WorkplaceSearch from "./WorkplaceSearch";

export default function Router() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="workplace-search" element={<WorkplaceSearch />} />
      </Routes>
    </div>
  );
}
