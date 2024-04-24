import { atom, map } from "nanostores";
import { ActionBarSections } from "./types";

export const actionBarOpen = atom(true);
export const actionBarSearch = atom("");
export const actionBarSelectedId = atom<string | null>(null);
export const actionBarChatMode = atom(false);
export const actionBarVisibleSections = map<ActionBarSections>({});
