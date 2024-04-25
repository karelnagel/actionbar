import { useEffect } from "react";
import {
  actionBarItems,
  actionBarOpen,
  actionBarSearch,
  actionBarPanels,
  actionBarSelectedId,
  actionBarVisibleSections,
  actionBarCurrentPanel,
} from "./state";
import { useStore } from "@nanostores/react";

const handleOpenCloseKeys = (e: any) => {
  if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
    e.preventDefault();
    actionBarOpen.set(!actionBarOpen.get());
  }
  if (e.key === "Escape" && actionBarOpen.get()) {
    e.preventDefault();
    actionBarOpen.set(false);
  }
  const panels = actionBarPanels.get();
  if (
    e.key === "Backspace" &&
    actionBarOpen.get() &&
    actionBarSearch.get() === "" &&
    panels.length > 1
  ) {
    e.preventDefault();
    actionBarPanels.set(panels.slice(0, -1));
  }
};
export const OpenCloseKeys = () => {
  useEffect(() => {
    document.addEventListener("keydown", handleOpenCloseKeys);
    return () => document.removeEventListener("keydown", handleOpenCloseKeys);
  }, []);
  return null;
};

const handleUpDown = (e: any) => {
  const open = actionBarOpen.get();
  if (!open) return;

  const selectedId = actionBarSelectedId.get();
  const allItems = actionBarItems.get();
  const selectedIndex = allItems.findIndex((i) => i.id === selectedId);

  let id;
  if (e.key === "ArrowUp") {
    id = allItems[Math.max(0, selectedIndex - 1)]?.id;
  } else if (e.key === "ArrowDown") {
    id = allItems[Math.min(allItems.length - 1, selectedIndex + 1)]?.id;
  } else return;

  e.preventDefault();
  actionBarSelectedId.set(id || null);
  if (id)
    document
      .getElementById(id)
      ?.scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" });
};

export const UpDownKeys = () => {
  useEffect(() => {
    document.addEventListener("keydown", handleUpDown);
    return () => document.removeEventListener("keydown", handleUpDown);
  }, []);
  return null;
};

export const CheckIfSomeItemIsSelected = () => {
  const selectedId = useStore(actionBarSelectedId);
  const allItems = useStore(actionBarItems);
  useEffect(() => {
    const selected = allItems.some((i) => i.id === selectedId);
    if (!selected) actionBarSelectedId.set(allItems[0]?.id || null);
  }, [selectedId, allItems]);
  return null;
};

export const compare = (a: string, b: string) => a.toLowerCase().includes(b.toLowerCase());

export const FilterSections = () => {
  const panel = useStore(actionBarCurrentPanel);
  const search = useStore(actionBarSearch);
  useEffect(() => {
    const sections = panel?.sections;
    if (!sections) return;

    // Sets all the elements to loading
    const loadingDate = new Date();
    actionBarVisibleSections.set({});
    for (const [key, section] of Object.entries(sections)) {
      actionBarVisibleSections.setKey(key, { ...section, items: [], loadingDate });
    }
    // Object.entries(actionBarVisibleSections.get()).forEach(([key, section]) => {
    //   actionBarVisibleSections.setKey(key, { ...section, loadingDate });
    // });

    const promises = Object.entries(sections).map(async ([key, section]) => {
      let items;
      if (section.type === "static") {
        items = section.items.filter((i) => compare(i.title, search));
      } else if (section.type === "fetch-on-search") {
        if (section.debounce) await new Promise((r) => setTimeout(r, section.debounce));
        const currentSection = actionBarVisibleSections.get()[key];
        if (!currentSection?.loadingDate || currentSection?.loadingDate === loadingDate) {
          items = await section.items(search);
        }
      }
      const oldSection = actionBarVisibleSections.get()[key];
      // To prevent the loading indicator from hiding when one fn finishes but it isn't the last one
      if (items && (!oldSection?.loadingDate || oldSection?.loadingDate === loadingDate)) {
        actionBarVisibleSections.setKey(key, {
          ...section,
          items: items.map((item, i) => ({ ...item, id: item.id || `${key}-${i}` })),
          loadingDate: null,
        });
      }
    });

    Promise.all(promises);
  }, [search, panel]);
  return null;
};
