import * as React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import WorkplaceSearch from "./pages/workplace-search";
import AppSearch from './pages/app-search';
import Elasticsearch from './pages/elasticsearch'

export default function Router() {
  return (
    <div className="App">
      <Switch>
        <Route exact path="/">
          <Redirect to="/app-site-search" />
        </Route>
        <Route exact path="/app-site-search">
          <AppSearch />
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
