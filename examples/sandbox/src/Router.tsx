import * as React from "react";
import { Switch, Route, useLocation } from "react-router-dom";
import Root from "./pages/home";
import ElasticsearchBasic from "./pages/elasticsearch-basic";
import ElasticsearchProductionReady from "./pages/elasticsearch-production-ready";
import Engines from "./pages/engines";
import SiteSearch from "./pages/site-search";
import SearchAsYouType from "./pages/search-as-you-type";
import CustomizingStylesAndHtml from "./pages/customizing-styles-and-html";
import SearchBarInHeaderIndex from "./pages/search-bar-in-header/index";
import SearchBarInHeaderSearch from "./pages/search-bar-in-header/search";
import EcommerceHome from "./pages/ecommerce";
import EcommerceSearch from "./pages/ecommerce/Search";
import EcommerceCategory from "./pages/ecommerce/Category";
import ListingPage from "./pages/ecommerce/ListingPage";

export default function Router() {
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  return (
    <div className={`${isHomePage ? "App" : "text-black bg-white"}`}>
      <Switch>
        <Route exact path="/" component={Root} />

        {/* Connectors */}
        <Route
          exact
          path="/elasticsearch-basic"
          component={ElasticsearchBasic}
        />
        {/* TODO: Add back in when we have a production-ready connector */}
        {/* <Route
          exact
          path="/elasticsearch-production-ready"
          component={ElasticsearchProductionReady}
        /> */}
        <Route exact path="/site-search" component={SiteSearch} />
        <Route exact path="/engines" component={Engines} />

        {/* Examples */}
        <Route exact path="/search-as-you-type" component={SearchAsYouType} />
        <Route
          exact
          path="/customizing-styles-and-html"
          component={CustomizingStylesAndHtml}
        />
        <Route
          exact
          path="/search-bar-in-header"
          component={SearchBarInHeaderIndex}
        />
        <Route
          exact
          path="/search-bar-in-header/search"
          component={SearchBarInHeaderSearch}
        />

        {/* Use cases */}
        <Route exact path="/ecommerce/" component={EcommerceHome} />
        <Route exact path="/ecommerce/search" component={EcommerceSearch} />
        <Route exact path="/ecommerce/all" component={ListingPage} />
        <Route
          exact
          path="/ecommerce/category/:category"
          component={EcommerceCategory}
        />
      </Switch>
    </div>
  );
}
