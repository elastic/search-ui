import React from "react";
import { mount } from "enzyme";

import { SearchContext } from "..";

it("Should be a context", () => {
  const value = mount(
    <SearchContext.Provider value={"hi"}>
      <SearchContext.Consumer>
        {value => <div>{value}</div>}
      </SearchContext.Consumer>
    </SearchContext.Provider>
  );

  expect(value.text()).toBe("hi");
});
