import { Fragment, useEffect, useRef } from "react";
import { useStore } from "@nanostores/react";
import {
  actionBarOpen,
  actionBarSearch,
  actionBarSelectedIndex,
  actionBarVisibleSections,
} from "./state";
import { ArrowUpRight, Loader2, LucideIcon } from "lucide-react";

export const useKeyboardShortcuts = () => {
  useEffect(() => {
    const down = (e: any) => {
      const open = actionBarOpen.get();
      const index = actionBarSelectedIndex.get();
      const visibleSections = actionBarVisibleSections.get();
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        actionBarOpen.set(!open);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        actionBarSelectedIndex.set(Math.max(0, index - 1));
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        actionBarSelectedIndex.set(
          Math.min(Object.values(visibleSections).flatMap((s) => s.items).length - 1, index + 1),
        );
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);
};
export type ActionBarSectionsInput = Record<string, ActionBarSectionInput>;
export type ActionBarSectionInput = {
  title: string;
} & (
  | {
      type: "static";
      items: ActionBarItem[];
    }
  // | {
  //     type: "fetch-on-load";
  //     items: () => Promise<ActionBarItem[]>;
  //   }
  | {
      type: "fetch-on-search";
      debounce?: number;
      items: (search: string) => Promise<ActionBarItem[]>;
    }
);
export type ActionBarSections = Record<string, ActionBarSection>;
export type ActionBarSection = {
  title: string;
  items?: ActionBarItem[];
  loadingDate: Date | null;
};

export type ActionBarItem = {
  title: string;
  href?: string;
  Icon?: LucideIcon;
  cta?: string;
  action?: (() => void) | (() => Promise<void>);
  // actionArgs?
};

const compare = (a: string, b: string) => a.toLowerCase().includes(b.toLowerCase());

const filterSections = async (sections: ActionBarSectionsInput, search: string) => {
  // Sets all the elements to loading
  const loadingDate = new Date();
  Object.entries(actionBarVisibleSections.get()).forEach(([key, section]) => {
    actionBarVisibleSections.setKey(key, { ...section, loadingDate });
  });

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
    if ((items && !oldSection?.loadingDate) || oldSection?.loadingDate === loadingDate) {
      actionBarVisibleSections.setKey(key, { ...section, items, loadingDate: null });
    }
  });

  await Promise.all(promises);
};

type ActionBarProps = { sections: ActionBarSectionsInput };

export const ActionBar = ({ sections }: ActionBarProps) => {
  const open = useStore(actionBarOpen);
  const search = useStore(actionBarSearch);
  const selectedIndex = useStore(actionBarSelectedIndex);
  const visibleSections = useStore(actionBarVisibleSections);
  const inputRef = useRef<HTMLInputElement>(null);

  useKeyboardShortcuts();

  useEffect(() => inputRef.current?.focus(), [open]);
  useEffect(() => {
    filterSections(sections, search);
  }, [sections, search]);

  return (
    <div
      style={{ colorScheme: "dark" }}
      className={`fixed left-0 top-0 h-screen w-screen items-start justify-center p-4 pt-[20vh] duration-150 ${
        open ? "flex bg-black/20" : "hidden"
      }`}
      onClick={() => actionBarOpen.set(false)}
    >
      <div
        className="flex h-full max-h-[380px] w-full max-w-[700px] flex-col overflow-hidden rounded-2xl border border-white/15 bg-[#121212] text-white"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4">
          <input
            ref={inputRef}
            type="text"
            className="placeholder:text-current/50 w-full bg-transparent text-[18px] focus:outline-none"
            value={search}
            placeholder="What do you need?"
            onChange={(e) => actionBarSearch.set(e.target.value)}
          />
        </div>
        <div className="h-[1px] w-full bg-white/15"></div>
        <div className="flex h-full flex-col overflow-y-auto p-3">
          {Object.entries(visibleSections)
            .filter(([_, section]) => section.loadingDate || section.items?.length)
            .map(([key, section]) => (
              <Fragment key={key}>
                <div className="flex items-center gap-1 py-1 text-sm text-white/50">
                  <p>{section.title}</p>
                  {section.loadingDate && <Loader2 className="h-3 w-3 animate-spin" />}
                </div>
                {section.items?.map((item, i) => (
                  <Item selected={selectedIndex === i} key={i} item={item} index={i} />
                ))}
              </Fragment>
            ))}
        </div>
      </div>
    </div>
  );
};

type ItemProps = {
  item: ActionBarItem;
  selected: boolean;
  index: number;
};

const Item = ({ item, selected, index }: ItemProps) => {
  const action = () => {
    if (item.action) item.action();
    if (item.href) window.location.href = item.href;
  };

  useEffect(() => {
    const listenToEnter = (e: any) => {
      if (actionBarOpen.get() && e.key === "Enter") action();
    };
    document.addEventListener("keydown", listenToEnter);
    return () => document.removeEventListener("keydown", listenToEnter);
  }, []);
  const Icon = item.Icon || ArrowUpRight;
  return (
    <button
      onMouseEnter={() => actionBarSelectedIndex.set(index)}
      className={`${selected ? "bg-white/10 text-white" : "text-white/70"} flex items-center gap-2 rounded-md p-2 text-[15px] duration-150`}
      onClick={action}
    >
      <Icon className={`h-5 w-5 rounded-md `} />
      <span>{item.title}</span>
      <span
        className={`${selected ? "opacity-60" : "opacity-0"} ml-auto rounded-md  p-1 text-xs duration-150`}
      >
        {item.cta || "Go to"}
      </span>
    </button>
  );
};
