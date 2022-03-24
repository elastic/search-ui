const path = require("path");

const siteDir = __dirname;

const docsConfig = {
  // nav config to rule them all
  nav: path.join(siteDir, "nav.json"),

  // source configs
  sources: path.join(siteDir, "sources.json"),
  devSources: path.join(siteDir, "sources-dev.json"),

  // variable interpolation config
  variables: path.join(siteDir, "config", "variables.json"),

  // component configs
  badge: path.join(siteDir, "config", "badge.js"),
  callout: path.join(siteDir, "config", "callout.js"),

  // variable for Google Analytics Tracking ID
  googleAnalyticsTrackingId: "Replaceme",
};

module.exports = { docsConfig };
