"use strict";

var reactSearchComponents = require("@elastic/react-search-components");
var searchUi = require("@elastic/search-ui");

module.exports = reactSearchUi;

function reactSearchUi() {
  reactSearchComponents();
  searchUi();
}
