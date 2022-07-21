import * as React from "react";
import { Switch } from "react-router-dom";
import Root from "./pages/root";
import Elasticsearch from "./pages/elasticsearch";
import AppSearch from "./pages/app-search";
import SiteSearch from "./pages/site-search";
import WorkplaceSearch from "./pages/workplace-search";
import SearchAsYouType from "./pages/search-as-you-type";
import CustomizingStylesAndHtml from "./pages/customizing-styles-and-html";
import SearchBarInHeaderIndex from "./pages/search-bar-in-header/index";
import SearchBarInHeaderSearch from "./pages/search-bar-in-header/search";
import ProductListingPage from "./pages/product-listing-page";
import ProductListingPageTvs from "./pages/product-listing-page/tvs";
import { ApmRoute } from "@elastic/apm-rum-react";

export default function Router() {
  return (
    <div className="App">
      <Switch>
        <ApmRoute exact path="/" component={Root} />
        <ApmRoute exact path="/elasticsearch" component={Elasticsearch} />
        <ApmRoute exact path="/app-search" component={AppSearch} />
        <ApmRoute exact path="/site-search" component={SiteSearch} />
        <ApmRoute exact path="/workplace-search" component={WorkplaceSearch} />
        <ApmRoute
          exact
          path="/search-as-you-type"
          component={SearchAsYouType}
        />
        <ApmRoute
          exact
          path="/customizing-styles-and-html"
          component={CustomizingStylesAndHtml}
        />
        <ApmRoute
          exact
          path="/search-bar-in-header"
          component={SearchBarInHeaderIndex}
        />
        <ApmRoute
          exact
          path="/search-bar-in-header/search"
          component={SearchBarInHeaderSearch}
        />

        <ApmRoute
          exact
          path="/product-listing-page/"
          component={ProductListingPage}
        />
        <ApmRoute
          exact
          path="/product-listing-page/tvs"
          component={ProductListingPageTvs}
        />
      </Switch>
    </div>
  );
}
