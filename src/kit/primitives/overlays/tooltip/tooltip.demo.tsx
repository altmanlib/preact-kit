import { Settings } from "lucide-preact";

import { defineDemo } from "../../../demo.ts";
import { Button } from "../../actions/button/index.tsx";
import { IconButton } from "../../actions/icon-button/index.tsx";
import { Tooltip } from "./index.tsx";

export default defineDemo({
  name: "Tooltip",
  kind: "primitive",
  summary: "A short hint for a control, on hover and on keyboard focus.",
  examples: [
    {
      title: "On a button and an icon button",
      note: "Hover, or tab to the control. Keep it to a few words.",
      render: () => (
        <>
          <Tooltip text="Saves without publishing">
            <Button>Save draft</Button>
          </Tooltip>
          <Tooltip text="Settings">
            <IconButton label="Settings">
              <Settings aria-hidden="true" />
            </IconButton>
          </Tooltip>
        </>
      ),
    },
  ],
});
