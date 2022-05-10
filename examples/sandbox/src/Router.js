import * as React from "react";
import { Switch, Route } from "react-router-dom";
import Root from "./pages/root";
import Elasticsearch from "./pages/elasticsearch";
import AppSearch from "./pages/app-search";
import SiteSearch from "./pages/site-search";
import WorkplaceSearch from "./pages/workplace-search";
import SearchAsYouType from "./pages/search-as-you-type";
import CustomizingStylesAndHtml from "./pages/customizing-styles-and-html";
import SearchBarInHeader from "./pages/search-bar-in-header";

export default function Router() {
  return (
    <div className="App">
      <Switch>
        <Route exact path="/">
          <Root />
        </Route>
        <Route exact path="/elasticsearch">
          <Elasticsearch />
        </Route>
        <Route exact path="/app-search">
          <AppSearch />
        </Route>
        <Route exact path="/site-search">
          <SiteSearch />
        </Route>
        <Route exact path="/workplace-search">
          <WorkplaceSearch />
        </Route>
        <Route exact path="/search-as-you-type">
          <SearchAsYouType />
        </Route>
        <Route exact path="/customizing-styles-and-html">
          <CustomizingStylesAndHtml />
        </Route>
        <Route exact path="/search-bar-in-header">
          <SearchBarInHeader />
        </Route>
      </Switch>
    </div>
  );
}
