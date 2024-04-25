import { ReactNode } from "react";

export type ActionBarPanel = {
  sections: Record<string, ActionBarSection>;
  placeholder: string;
  name?: string;
};
export type ActionBarSection = {
  title?: string;
} & (
  | {
      type: "static";
      items: ActionBarItem[];
    }
  | {
      type: "fetch-on-search";
      debounce?: number;
      items: (search: string) => Promise<ActionBarItem[]>;
    }
);

type ActionArgs = { search: string };

export type ActionBarItem = {
  id?: string;
  title: string;
  icon?: ReactNode;
  matchAll?: boolean;
  disabled?: boolean;
} & (
  | { action?: string | ((a: ActionArgs) => void) | ((a: ActionArgs) => Promise<void>) }
  | { panel: ActionBarPanel }
);

// Internal
export type ActionBarInternalSection = {
  title?: string;
  items: ActionBarInternalItem[];
  loadingDate: Date | null;
};

export type ActionBarInternalItem = ActionBarItem & { id: string };

export type ActionBarInternalElement =
  | { type: "section"; title?: string; loading: boolean }
  | { type: "item"; item: ActionBarInternalItem };
