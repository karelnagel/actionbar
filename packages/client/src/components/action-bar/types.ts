import type { LucideIcon } from "lucide-react";

export type ActionBarSectionsInput = Record<string, ActionBarSectionInput>;
export type ActionBarSectionInput = {
  title: string;
} & (
  | {
      type: "static";
      items: ActionBarItemInput[];
    }
  // | {
  //     type: "fetch-on-load";
  //     items: () => Promise<ActionBarItem[]>;
  //   }
  | {
      type: "fetch-on-search";
      debounce?: number;
      items: (search: string) => Promise<ActionBarItemInput[]>;
    }
);

export type ActionBarItemInput = {
  title: string;
  href?: string;
  Icon?: LucideIcon;
  cta?: string;
  id?: string;
  action?: (() => void) | (() => Promise<void>);
  // actionArgs?
};

export type ActionBarSections = Record<string, ActionBarSection>;
export type ActionBarSection = {
  title: string;
  items: ActionBarItem[];
  loadingDate: Date | null;
};

export type ActionBarItem = {
  title: string;
  href?: string;
  Icon?: LucideIcon;
  cta?: string;
  id: string;
  action?: (() => void) | (() => Promise<void>);
};

export type ActionBarElement =
  | { type: "section"; title: string; loading: boolean }
  | { type: "item"; item: ActionBarItem };
