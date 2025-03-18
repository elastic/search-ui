import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import Router from "./Router";
import "./styles.css";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <Router />
  </BrowserRouter>
);
