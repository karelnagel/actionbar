import { Fragment, useEffect, useRef } from "react";
import { useStore } from "@nanostores/react";
import { actionBarChatMode, actionBarOpen, actionBarSearch, actionBarSelectedIndex } from "./state";
import { ArrowUpRight, LucideIcon, FileIcon } from "lucide-react";

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
  Icon?: LucideIcon;
  cta?: string;
  action?: (() => void) | (() => Promise<void>);
};

const POSTS: Item[] = [
  { title: "Cats", href: "/cats", Icon: FileIcon },
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
];

const compare = (a: string, b: string) => a.toLowerCase().includes(b.toLowerCase());
type ActionBarProps = {};
export const ActionBar = ({}: ActionBarProps) => {
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
      style={{
        display: open ? "flex" : "none",
        background: open ? "rgba(0,0,0,0.2)" : "none",
        colorScheme: "dark",
      }}
      className="absolute left-0 top-0 h-full w-full items-center justify-center p-4 duration-150"
      onClick={() => actionBarOpen.set(false)}
    >
      <div
        className="w-full max-w-[700px] rounded-2xl border border-white/15 bg-[#121212] text-white"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-3">
          <input
            ref={inputRef}
            type="text"
            className="placeholder:text-current/50 bg-transparent text-xl focus:outline-none"
            value={search}
            placeholder="What do you need?"
            onChange={(e) => actionBarSearch.set(e.target.value)}
          />
        </div>
        <div className="h-[1px] w-full bg-white/15"></div>
        <div className="flex max-h-[300px] flex-col overflow-y-scroll p-3">
          {SECTIONS.map((section) => (
            <Fragment key={section.title}>
              <p className="py-1 text-sm text-white/50">{section.title}</p>
              {section.items
                ?.filter((item) => compare(item.title, search))
                .map((item, i) => (
                  <ActionItem
                    selected={selectedIndex === i}
                    key={item.title}
                    item={item}
                    index={i}
                  />
                ))}
            </Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

const ActionItem = ({
  item,
  selected,
  index,
}: {
  item: Item;
  selected: boolean;
  index: number;
}) => {
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
      <Icon className="h-5 w-5" />
      <span>{item.title}</span>
      <span
        className={`${selected ? "opacity-60" : "opacity-0"} ml-auto rounded-md  p-1 text-xs duration-150`}
      >
        {item.cta || "Go to"}
      </span>
    </button>
  );
};
