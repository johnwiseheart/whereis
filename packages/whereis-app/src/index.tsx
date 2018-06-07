import { normalize, setupPage } from "csstips";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { cssRaw, cssRule } from "typestyle";
import "whatwg-fetch";
import { setupLoader } from "./loader";
import WhereIs from "./WhereIs";

normalize();
setupPage("#app");
setupLoader();

cssRaw(`@import url("https://fonts.googleapis.com/css?family=Open+Sans");`);

cssRule("html, body", {
  backgroundColor: "#e3e7e8",
  color: "#3c3c3c",
  fontFamily: '"Open Sans", sans-serif',
  height: "100%",
});

cssRule(".mapboxgl-missing-css", {
  display: "none",
});

ReactDOM.render(<WhereIs />, document.getElementById("app"));
