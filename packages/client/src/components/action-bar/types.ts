import type { LucideIcon } from "lucide-react";

export type ActionBarPanel = {
  sections: Record<string, ActionBarSectionInput>;
  placeholder: string;
  name?: string;
};
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
  id?: string;
  title: string;
  Icon?: LucideIcon;
  cta?: string;
} & (
  | {
      action?: string | (() => void) | (() => Promise<void>);
    }
  | { panel: ActionBarPanel }
);

export type ActionBarSections = Record<string, ActionBarSection>;
export type ActionBarSection = {
  title: string;
  items: ActionBarItem[];
  loadingDate: Date | null;
};

export type ActionBarItem = ActionBarItemInput & { id: string };

export type ActionBarElement =
  | { type: "section"; title: string; loading: boolean }
  | { type: "item"; item: ActionBarItem };
