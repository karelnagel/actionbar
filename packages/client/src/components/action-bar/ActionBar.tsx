import { useEffect, useRef } from "react";
import { useStore } from "@nanostores/react";
import { actionBarChatMode, actionBarOpen, actionBarSearch, actionBarSelectedIndex } from "./state";

export const useKeyboardShortcuts = () => {
  useEffect(() => {
    const down = (e: any) => {
      const open = actionBarOpen.get();
      const index = actionBarSelectedIndex.get();
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        actionBarOpen.set(!open);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        actionBarSelectedIndex.set(Math.max(0, index - 1));
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        actionBarSelectedIndex.set(Math.min(POSTS.length - 1, index + 1));
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);
};

type Section = {
  title: string;
  items?: Item[];
  fetch?: (search: string) => Promise<Item[]>;
};

type Item = {
  title: string;
  href?: string;
  action?: (() => void) | (() => Promise<void>);
  askAI?: boolean;
};

const POSTS: Item[] = [
  { title: "Cats", href: "/cats" },
  { title: "Dogs", href: "/dogs" },
  { title: "Rats", href: "/rats" },
  { title: "Bats", href: "/bats" },
  { title: "Bats", href: "/bats" },
  { title: "Bats", href: "/bats" },
  { title: "Bats", href: "/bats" },
  { title: "Bats", href: "/bats" },
];
const ACTIONS: Item[] = [
  {
    title: "Change theme",
    action: () => {
      document.body.classList.toggle("dark");
      alert("changed");
    },
  },
  {
    title: "Get weather",
    action: () => {
      fetch(
        "https://api.openweathermap.org/data/2.5/weather?q=London,uk&appid=b6907d289e10d71b81512d96756a52552",
      )
        .then((res) => res.json())
        .then((data) => {
          alert(JSON.stringify(data));
        });
    },
  },
];
const SECTIONS: Section[] = [
  { title: "Blog", items: POSTS },
  { title: "Actions", items: ACTIONS },
  {
    title: "Search",
    fetch: async (search: string) => {
      // Todo fetch
      const items: { title: string }[] = [{ title: search }];
      return items;
    },
  },
  { title: "AI", items: [{ title: "Ask AI", askAI: true }] },
];

const compare = (a: string, b: string) => a.toLowerCase().includes(b.toLowerCase());
type ActionBarProps = {
  hideSections?: boolean;
};
export const ActionBar = ({ hideSections }: ActionBarProps) => {
  const open = useStore(actionBarOpen);
  const search = useStore(actionBarSearch);
  const selectedIndex = useStore(actionBarSelectedIndex);
  const inputRef = useRef<HTMLInputElement>(null);

  useKeyboardShortcuts();

  useEffect(() => {
    inputRef.current?.focus();
  }, [open]);
  useEffect(() => {
    console.log(actionBarSelectedIndex.get());
  }, [actionBarSelectedIndex]);
  return (
    <div
      style={{ display: open ? "flex" : "none" }}
      className="absolute left-0 top-0 h-full w-full items-center justify-center"
      onClick={() => actionBarOpen.set(false)}
    >
      <div className="rounded-md bg-blue-300 p-10 " onClick={(e) => e.stopPropagation()}>
        <input
          ref={inputRef}
          type="text"
          value={search}
          onChange={(e) => actionBarSearch.set(e.target.value)}
        />
        <div className="flex flex-col">
          {SECTIONS.map((section) => (
            <div key={section.title}>
              {!hideSections && <p className="text-sm font-semibold uppercase">{section.title}</p>}
              <div className="flex flex-col items-start gap-1">
                {section.items
                  ?.filter((item) => compare(item.title, search))
                  .map((item, i) => (
                    <ActionItem selected={selectedIndex === i} key={item.title} {...item} />
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const ActionItem = (item: Item & { selected: boolean }) => {
  useEffect(() => {
    const listenToEnter = (e: any) => {
      const open = actionBarOpen.get();
      if (!open) return;

      if (e.key === "Enter") {
        if (item.action) item.action?.();
        else if (item.askAI) actionBarChatMode.set(true);
        else if (item.href) window.location.href = item.href;
      }
    };
    document.addEventListener("keydown", listenToEnter);
    return () => document.removeEventListener("keydown", listenToEnter);
  }, []);

  if ("href" in item)
    return (
      <a style={{ background: item.selected ? "red" : undefined }} href={item.href}>
        {item.title}
      </a>
    );

  return (
    <button style={{ background: item.selected ? "red" : undefined }} onClick={item.action}>
      {item.title}
    </button>
  );
};
