"use strict";

import reactSearchComponents from "@elastic/react-search-components";
import { SearchDriver } from "@elastic/search-ui";

export default function reactSearchUi() {
  reactSearchComponents();
  console.log(SearchDriver);
}
