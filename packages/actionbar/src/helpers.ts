import { actionBarSearch, actionBarOpen, actionBarPanels } from "./state";
import type { ActionBarInternalItem } from "./types";

import clsx, { ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export const cn = (...classes: ClassValue[]) => twMerge(clsx(...classes))

export const callAction = (item: ActionBarInternalItem) => {
  if (item.disabled) return;
  if ("action" in item) {
    if (typeof item.action === "string") window.location.href = item.action;
    if (typeof item.action === "function") item.action({ search: actionBarSearch.get() });
    actionBarOpen.set(false);
  } else if ("panel" in item) {
    actionBarPanels.set([...actionBarPanels.get(), item.panel]);
    actionBarSearch.set("");
  }
};

export const compare = (a: string, b: string) => a.toLowerCase().includes(b.toLowerCase());
