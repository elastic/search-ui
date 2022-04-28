import * as React from "react";
import { Switch, Route } from "react-router-dom";
import WorkplaceSearch from "./pages/workplace-search";
import AppSearch from "./pages/app-search";
import SiteSearch from "./pages/site-search";
import Root from "./pages/root";
import Elasticsearch from "./pages/elasticsearch";

export default function Router() {
  return (
    <div className="App">
      <Switch>
        <Route exact path="/">
          <Root />
        </Route>
        <Route exact path="/app-search">
          <AppSearch />
        </Route>
        <Route exact path="/site-search">
          <SiteSearch />
        </Route>
        <Route exact path="/elasticsearch">
          <Elasticsearch />
        </Route>
        <Route exact path="/workplace-search">
          <WorkplaceSearch />
        </Route>
      </Switch>
    </div>
  );
}
