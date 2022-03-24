import React from "react";
import { mount } from "enzyme";

import { SearchContext } from "..";
import { SearchDriver } from "@elastic/search-ui";

it("Should be a context", () => {
  const searchDriver = new SearchDriver({
    apiConnector: null
  });

  searchDriver.state.searchTerm = "a search term";

  const value = mount(
    <SearchContext.Provider value={{ driver: searchDriver }}>
      <SearchContext.Consumer>
        {({ driver }) => <div>{driver.state.searchTerm}</div>}
      </SearchContext.Consumer>
    </SearchContext.Provider>
  );

  expect(value.text()).toBe("a search term");
});
