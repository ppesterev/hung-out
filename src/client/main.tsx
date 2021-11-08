import { render } from "preact";

import App from "./components/App";

import { GlobalStyle } from "./styled";

render(
  <>
    <GlobalStyle />
    <App />
  </>,
  document.getElementById("app")!
);
