import { render } from "preact";

import { applyTheme } from "../kit/lib/theme.ts";
import { App } from "./app.tsx";

applyTheme();
const root = document.getElementById("app");
if (root) render(<App />, root);
