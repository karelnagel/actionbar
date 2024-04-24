import { useEffect } from "react";
import { actionBarOpen, actionBarSelectedId, actionBarVisibleSections } from "./state";
import { useStore } from "@nanostores/react";

const handleOpenCloseKeys = (e: any) => {
  if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
    e.preventDefault();
    actionBarOpen.set(!open);
  }
  if (e.key === "Escape" && actionBarOpen.get()) {
    e.preventDefault();
    actionBarOpen.set(false);
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
  const allItems = Object.values(actionBarVisibleSections.get()).flatMap((s) => s.items);
  const selectedIndex = allItems.findIndex((i) => i.id === selectedId);

  if (e.key === "ArrowUp") {
    e.preventDefault();
    const id = allItems[Math.max(0, selectedIndex - 1)]?.id;
    actionBarSelectedId.set(id || null);
  }
  if (e.key === "ArrowDown") {
    e.preventDefault();
    const id = allItems[Math.min(allItems.length - 1, selectedIndex + 1)]?.id;
    actionBarSelectedId.set(id || null);
  }
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
  const visibleSections = useStore(actionBarVisibleSections);
  useEffect(() => {
    const allItems = Object.values(visibleSections).flatMap((s) => s.items);
    const selected = allItems.some((i) => i.id === selectedId);
    if (!selected) actionBarSelectedId.set(allItems[0]?.id || null);
  }, [selectedId, visibleSections]);
  return null;
};
