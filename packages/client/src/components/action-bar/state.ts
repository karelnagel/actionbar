import { atom, computed, map } from "nanostores";
import { ActionBarElement, ActionBarSections, ActionBarPanel } from "./types";

export const actionBarOpen = atom(true);
export const actionBarSearch = atom("");
export const actionBarSelectedId = atom<string | null>(null);

// Todo rename to actionBarPanels
export const actionBarPanels = atom<ActionBarPanel[]>([]);
export const actionBarCurrentPanel = computed(
  actionBarPanels,
  (panels) => panels[panels.length - 1],
);

export const actionBarVisibleSections = map<ActionBarSections>({});

export const actionBarElements = computed(actionBarVisibleSections, (sections) => {
  const elements: ActionBarElement[] = Object.values(sections)
    .filter((section) => section.items.length)
    .flatMap((section) => [
      { type: "section", title: section.title, loading: section.loadingDate !== null },
      ...(section.items.map((item) => ({ type: "item" as const, item })) || []),
    ]);
  return elements;
});

export const actionBarItems = computed(actionBarElements, (elements) => {
  return elements.filter((x) => x.type === "item").map((x) => (x.type === "item" ? x.item : null)!);
});
