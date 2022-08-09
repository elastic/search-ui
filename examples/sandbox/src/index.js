import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import Router from "./Router";
import { init as initApm } from "@elastic/apm-rum";
import "./styles.css";

initApm({
  serviceName: "Search UI Sandbox",
  serverUrl:
    "https://68a4e94cc8b640e6a77b3da09dd7df30.apm.us-central1.gcp.cloud.es.io:443",
  // Set the service version (required for source map feature)
  serviceVersion: "",
  environment: process.env.NODE_ENV
});

ReactDOM.render(
  <BrowserRouter>
    <Router />
  </BrowserRouter>,
  document.getElementById("root")
);
