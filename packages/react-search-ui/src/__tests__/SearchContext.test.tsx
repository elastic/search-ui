import React from "react";
import { render, screen } from "@testing-library/react";

import { SearchContext } from "..";
import { SearchDriver } from "@elastic/search-ui";

it("Should be a context", () => {
  const searchDriver = new SearchDriver({
    apiConnector: null
  });

  searchDriver.state.searchTerm = "a search term";

  render(
    <SearchContext.Provider value={{ driver: searchDriver }}>
      <SearchContext.Consumer>
        {({ driver }) => <div>{driver.state.searchTerm}</div>}
      </SearchContext.Consumer>
    </SearchContext.Provider>
  );

  expect(screen.getByText("a search term")).toBeInTheDocument();
});
