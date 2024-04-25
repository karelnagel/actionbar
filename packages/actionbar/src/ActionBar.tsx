import { Fragment, ReactNode, useEffect, useRef } from "react";
import { useStore } from "@nanostores/react";
import {
  actionBarElements,
  actionBarOpen,
  actionBarSearch,
  actionBarPanels,
  actionBarCurrentPanel,
} from "./state";
import { Loader2 } from "lucide-react";
import { CheckIfSomeItemIsSelected, FilterSections, OpenCloseKeys, UpDownKeys } from "./hooks";
import { ActionBarPanel, ActionBarItem } from "./types";
import { ArrowUpRight } from "lucide-react";
import { useCallback } from "react";
import { actionBarSelectedId } from "./state";

export type ActionBarProps = { panel: ActionBarPanel };

export const ActionBar = ({ panel }: ActionBarProps) => {
  useEffect(() => {
    actionBarPanels.set([panel]);
  }, []);
  return (
    <>
      <UpDownKeys />
      <OpenCloseKeys />
      <CheckIfSomeItemIsSelected />
      <FilterSections />
      <Dialog>
        <Top />
        <div className="h-[1px] w-full bg-white/15"></div>
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
        className="flex h-full max-h-[380px] w-full max-w-[700px] flex-col overflow-hidden rounded-2xl border border-white/15 bg-[#121212] text-white"
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
              className="hover:bg-white/10 rounded-md cursor-pointer whitespace-nowrap"
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

const Bottom = () => {
  const elements = useStore(actionBarElements);

  return (
    <div className="flex h-full flex-col overflow-y-auto p-3">
      {elements.map((e) => {
        if (e.type === "section")
          return <Section key={e.title} title={e.title} loading={e.loading} />;
        return <Item key={e.item.id} item={e.item} />;
      })}
    </div>
  );
};

const Section = ({ title, loading }: { title: string; loading: boolean }) => {
  return (
    <div className="flex items-center gap-1 py-1 text-sm text-white/50">
      <p>{title}</p>
      {loading && <Loader2 className="h-3 w-3 animate-spin" />}
    </div>
  );
};

export const Item = ({ item }: { item: ActionBarItem }) => {
  const selectedId = useStore(actionBarSelectedId);
  const selected = selectedId === item.id;
  const action = useCallback(() => {
    if ("action" in item) {
      if (typeof item.action === "string") window.location.href = item.action;
      if (typeof item.action === "function") item.action();
      actionBarOpen.set(false);
    } else if ("panel" in item) {
      actionBarPanels.set([...actionBarPanels.get(), item.panel]);
      actionBarSearch.set("");
    }
    // Todo: if not action then it should go into the new sections
  }, [item]);

  useEffect(() => {
    const listenToEnter = (e: any) => {
      if (selected && actionBarOpen.get() && e.key === "Enter") action();
    };
    document.addEventListener("keydown", listenToEnter);
    return () => document.removeEventListener("keydown", listenToEnter);
  }, [selected, action]);

  return (
    <div
      id={item.id}
      onMouseEnter={() => actionBarSelectedId.set(item.id)}
      className={`${selected ? "bg-white/10 text-white" : "text-white/70"} flex cursor-pointer items-center gap-2 rounded-md p-2 text-[15px] duration-150`}
      onClick={action}
    >
      <div className="flex h-5 w-5 items-center justify-center rounded-md">
        {item.icon || <ArrowUpRight />}
      </div>
      <span>{item.title}</span>
      <span
        className={`${selected ? "opacity-60" : "opacity-0"} ml-auto rounded-md  p-1 text-xs duration-150`}
      >
        {item.cta || "Go to"}
      </span>
    </div>
  );
};
