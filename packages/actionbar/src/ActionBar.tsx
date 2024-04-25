import { Fragment, ReactNode, useEffect, useRef } from "react";
import { useStore } from "@nanostores/react";
import {
  actionBarElements,
  actionBarOpen,
  actionBarSearch,
  actionBarPanels,
  actionBarCurrentPanel,
} from "./state";
import { ArrowUpDown, CommandIcon, DeleteIcon, Loader2 } from "lucide-react";
import { Hooks, callAction } from "./hooks";
import { ActionBarPanel, ActionBarInternalItem } from "./types";
import { ArrowUpRight } from "lucide-react";
import { actionBarSelectedId } from "./state";

export type ActionBarProps = { panel: ActionBarPanel };

export const ActionBar = ({ panel }: ActionBarProps) => {
  useEffect(() => {
    actionBarPanels.set([panel]);
  }, []);
  return (
    <>
      <Hooks />
      <Dialog>
        <Top />
        <div className="h-[1px] w-full bg-white/15"></div>
        <Middle />
        <Bottom />
      </Dialog>
    </>
  );
};

const Dialog = ({ children }: { children: ReactNode }) => {
  const open = useStore(actionBarOpen);

  return (
    <div
      style={{ colorScheme: "dark" }}
      className={`fixed left-0 top-0 h-screen w-screen items-start justify-center p-4 pt-[20vh] duration-150 ${
        open ? "flex bg-black/20" : "hidden"
      }`}
      onClick={() => actionBarOpen.set(false)}
    >
      <div
        className="flex h-full max-h-[400px] w-full max-w-[700px] flex-col overflow-hidden rounded-2xl border border-white/15 bg-[#121212] text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
};

const Top = () => {
  const search = useStore(actionBarSearch);
  const open = useStore(actionBarOpen);
  const inputRef = useRef<HTMLInputElement>(null);
  const panels = useStore(actionBarPanels);
  const panel = useStore(actionBarCurrentPanel);
  useEffect(() => inputRef.current?.focus(), [open]);
  return (
    <div className="flex items-center gap-2 p-4 text-[18px]">
      {panels
        .filter((panel) => panel.name)
        .map((panel, i) => (
          <Fragment key={i}>
            <span
              onClick={() => actionBarPanels.set(panels.slice(0, i + 1))}
              className="cursor-pointer whitespace-nowrap rounded-md hover:bg-white/10"
            >
              {panel.name}
            </span>
            <span>/</span>
          </Fragment>
        ))}
      <input
        ref={inputRef}
        type="text"
        className="placeholder:text-current/50 w-full bg-transparent focus:outline-none"
        value={search}
        placeholder={panel?.placeholder}
        onChange={(e) => actionBarSearch.set(e.target.value)}
      />
    </div>
  );
};

const Middle = () => {
  const elements = useStore(actionBarElements);

  return (
    <div className="flex h-full flex-col overflow-y-auto p-3">
      {elements.map((e) => {
        if (e.type === "section" && e.title)
          return <Section key={e.title} title={e.title} loading={e.loading} />;
        else if (e.type === "item") return <Item key={e.item.id} item={e.item} />;
      })}
    </div>
  );
};

const Bottom = () => {
  return (
    <div className="flex w-full items-center justify-between border-t border-white/15 px-4 py-1 text-xs opacity-70">
      <p>
        Powered by{" "}
        <a className="text-blue-300" target="_blank" href="https://actionbar.asius.ai">
          ActionBar
        </a>
      </p>
      <div className="flex items-center gap-4">
        {[
          { Icon: ArrowUpDown, text: "Navigate" },
          { Icon: DeleteIcon, text: "Go back" },
          { Icon: Enter, text: "Select" },
          {
            Icon: CmdK,
            text: "Open",
          },
        ].map(({ Icon, text }) => (
          <div
            key={text}
            className="flex items-center gap-1 rounded-md p-1 duration-150 hover:bg-white/20"
          >
            <Icon className="h-4 w-auto" />
            <span className="text-xs">{text}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const CmdK = ({ className }: { className?: string }) => (
  <div className={"flex items-center gap-[1px] text-xs " + className}>
    <CommandIcon className="h-3 w-3" />
    <span>K</span>
  </div>
);

const Section = ({ title, loading }: { title: string; loading: boolean }) => {
  return (
    <div className="flex items-center gap-1 py-1 text-sm text-white/50">
      <p>{title}</p>
      {loading && <Loader2 className="h-3 w-3 animate-spin" />}
    </div>
  );
};

export const Item = ({ item }: { item: ActionBarInternalItem }) => {
  const selectedId = useStore(actionBarSelectedId);
  const selected = selectedId === item.id;
  // Todo solve onClick
  return (
    <div
      id={item.id}
      onMouseEnter={() => actionBarSelectedId.set(item.id)}
      className={`${selected ? "bg-white/10 text-white" : "text-white/70"} ${
        item.disabled ? "cursor-not-allowed text-white/50" : "cursor-pointer"
      } flex items-center gap-2 rounded-md p-2 text-[15px] duration-150`}
      onClick={() => callAction(item)}
    >
      <div className="flex h-5 w-5 items-center justify-center rounded-md">
        {item.icon || <ArrowUpRight />}
      </div>
      <span>{item.title}</span>
      <span
        className={`${selected ? "opacity-60" : "opacity-0"} ml-auto rounded-md  p-1 text-xs duration-150`}
      >
        <Enter />
      </span>
    </div>
  );
};

const Enter = ({ className }: { className?: string }) => {
  return (
    <svg
      fill="none"
      height="24"
      className={className}
      viewBox="0 0 24 24"
      width="24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipRule="evenodd" fill="currentColor" fillRule="evenodd">
        <path d="m3 14a1 1 0 0 1 1-1h12a3 3 0 0 0 3-3v-4a1 1 0 1 1 2 0v4a5 5 0 0 1 -5 5h-12a1 1 0 0 1 -1-1z" />
        <path d="m3.293 14.707a1 1 0 0 1 0-1.414l4-4a1 1 0 0 1 1.414 1.414l-3.293 3.293 3.293 3.293a1 1 0 1 1 -1.414 1.414z" />
      </g>
    </svg>
  );
};
