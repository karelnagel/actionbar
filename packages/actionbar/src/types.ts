import { ReactNode } from "react";

export type ActionBarStyle = {
  backgroundColor: string;
  shadowColor: string;
  borderColor: string;
  textColor: string;
  maxHeight: number;
  maxWidth: number;
  colorScheme: "light" | "dark";
  paddingTop: number;
  roundness: number;
  hideBottom: boolean;
  fullHeight: boolean;
};

export type ActionBarProps = { panel: ActionBarPanel; style?: Partial<ActionBarStyle> };

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
  description?: string;
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
