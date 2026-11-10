import type { Demo } from "../kit/demo.ts";
import { demos as kitDemos } from "./demos.gen.ts";
import theming from "./theming.demo.tsx";

/** Kit demos plus gallery-only pages. Gallery-only demos stay out of `src/kit`. */
export const demos: Demo[] = [...kitDemos, theming];
