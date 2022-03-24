/* eslint-disable @typescript-eslint/no-var-requires */
// import { registerDocCallOut } from 'docsmobile/src/components/doc_callout/callout_helpers';
const {
  registerDocCallOut,
} = require("@elastic/docsmobile/src/components/doc_callout/callout_helpers");

registerDocCallOut([
  {
    id: "development",
    title: "In development",
    message:
      "This functionality is in development and may be changed or removed completely in a future release. These features are unsupported and not subject to the support service level agreement of official generally available features.",
    color: "warning",
  },
  {
    id: "experimental",
    title: "Experimental feature",
    message:
      "This functionality is experimental and may be changed or removed completely in a future release. Elastic will take a best effort approach to fix any issues, but experimental features are not subject to the support service level agreement of official generally available features.",
    color: "warning",
  },
  {
    id: "beta",
    title: "Beta feature",
    message:
      "This functionality is in beta and is subject to change. The design and code is less mature than official generally available features and is being provided as-is with no warranties. Beta features are not subject to the support service level agreement of official generally available features.",
    color: "warning",
  },
]);
