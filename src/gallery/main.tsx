import { render } from "preact";

import { applyTheme } from "../kit/lib/theme.ts";
import { App } from "./app.tsx";
import { applyBrand } from "./brand.ts";

applyTheme();
applyBrand();
const root = document.getElementById("app");
if (root) render(<App />, root);
