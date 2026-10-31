import { render } from "preact";

import { App } from "./app.tsx";
import { applyTheme } from "./theme.ts";

applyTheme();
const root = document.getElementById("app");
if (root) render(<App />, root);
