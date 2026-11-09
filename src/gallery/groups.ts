import type { Demo } from "../kit/demo.ts";

/** The sidebar groups, in order, with the demos (by `name`) each holds. A demo that is in no group fails groups.test.ts. */
export const GROUPS: { title: string; names: string[] }[] = [
  { title: "Actions", names: ["Button", "IconButton", "Copy", "ConfirmButton"] },
  { title: "Form", names: ["Field", "NumberField", "Slider", "Switch", "RadioGroup", "TagsInput", "SearchInput", "FileUpload", "DatePicker"] },
  { title: "Selection", names: ["Select", "Combobox", "Suggest", "MentionInput", "Chips"] },
  { title: "Overlays", names: ["Modal", "Drawer", "DialogProvider", "Popover", "Dropdown", "Tooltip", "CommandPalette"] },
  { title: "Navigation", names: ["TopNav", "SubNav", "Tabs", "NavList", "Breadcrumb", "Pager"] },
  { title: "Feedback", names: ["Toast", "Alert", "Note", "Spinner", "Progress", "Skeleton", "Empty", "QueryStatus"] },
  { title: "Data display", names: ["DataTable", "Badge", "Tag", "Avatar", "Card", "Tile", "Fact", "Accordion", "Heading"] },
  { title: "Layout", names: ["Layout", "GlideHeight"] },
  { title: "Foundations", names: ["Motion", "ThemeSwitch"] },
  { title: "Patterns", names: ["ListPage"] },
];

/** The groups with their demos resolved and sorted by name; empty groups are left out. */
export function groupDemos(demos: Demo[]): { title: string; demos: Demo[] }[] {
  return GROUPS.map(({ title, names }) => ({
    title,
    demos: demos.filter((demo) => names.includes(demo.name)).sort((a, b) => a.name.localeCompare(b.name)),
  })).filter((group) => group.demos.length > 0);
}
