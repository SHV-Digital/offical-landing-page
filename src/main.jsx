import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles/index.css";
import { getLocale } from "./i18n";

const locale = getLocale(window.location.pathname);
document.documentElement.lang = locale.code;
const root = document.getElementById("root");
const app = (
  <React.StrictMode>
    <App locale={locale.code} />
  </React.StrictMode>
);

if (root.hasChildNodes()) {
  ReactDOM.hydrateRoot(root, app);
} else {
  ReactDOM.createRoot(root).render(app);
}
