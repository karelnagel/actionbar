import { atom, map } from "nanostores";
import { ActionBarSections } from "./ActionBar";

export const actionBarOpen = atom(true);
export const actionBarSearch = atom("");
export const actionBarSelectedIndex = atom(0);
export const actionBarChatMode = atom(false);
export const actionBarVisibleSections = map<ActionBarSections>({});
