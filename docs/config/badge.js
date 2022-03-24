// import { registerDocBadges } from 'docsmobile/src/components/doc_badge/badge_helpers';
const {
  registerDocBadges,
  // eslint-disable-next-line @typescript-eslint/no-var-requires
} = require("@elastic/docsmobile/src/components/doc_badge/badge_helpers.ts");

// Accepts, colors and iconTypes that match EuiBadge
registerDocBadges([
  {
    label: "Kibana",
    color: "hollow",
    iconType: "logoKibana",
    slug: "kibana",
  },
  {
    label: "Elasticsearch",
    color: "hollow",
    iconType: "logoElasticsearch",
  },
  {
    label: "Machine Learning",
    color: "hollow",
    iconType: "machineLearningApp",
  },
  {
    label: "Observability",
    color: "hollow",
    iconType: "logoObservability",
    slug: "observability",
  },
  {
    label: "Logs",
    color: "hollow",
    iconType: "logoLogging",
  },
  {
    label: "Metrics",
    color: "hollow",
    iconType: "logoMetrics",
  },
  {
    label: "Uptime",
    color: "hollow",
    iconType: "logoUptime",
  },
  {
    label: "APM",
    color: "hollow",
    iconType: "apmApp",
  },
  {
    label: "Beta",
    color: "warning",
    tooltTipContent:
      "This functionality is in beta and is subject to change. The design and code is less mature than official generally available features and is being provided as-is with no warranties. Beta features are not subject to the support service level agreement of official generally available features.",
  },
  {
    label: "In Development",
    color: "warning",
    tooltTipContent:
      "This functionality is in development and may be changed or removed completely in a future release. These features are unsupported and not subject to the support service level agreement of official generally available features.",
  },
  {
    label: "Experimental",
    color: "warning",
    tooltTipContent:
      "This functionality is experimental and may be changed or removed completely in a future release. Elastic will take a best effort approach to fix any issues, but experimental features are not subject to the support service level agreement of official generally available features.",
  },
]);
