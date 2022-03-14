import * as React from "react";
import { Switch, Route } from "react-router-dom";
import "./App.css";
import App from "./App";
import WorkplaceSearch from "./WorkplaceSearch";

export default function Router() {
  return (
    <div className="App">
      <Switch>
        <Route exact path="/">
          <App />
        </Route>
        <Route exact path="/workplace-search">
          <WorkplaceSearch />
        </Route>
      </Switch>
    </div>
  );
}
