import { Fragment, ReactNode, useEffect, useRef } from "react";
import { useStore } from "@nanostores/react";
import {
  actionBarElements,
  actionBarOpen,
  actionBarSearch,
  actionBarPanels,
  actionBarCurrentPanel,
  actionBarStyle,
  useActionBarStyle,
  col,
} from "./state";
import { ArrowUpDown, CommandIcon, DeleteIcon, Loader2 } from "lucide-react";
import { Hooks } from "./hooks";
import { callAction } from "./helpers";
import { ActionBarInternalItem, ActionBarProps } from "./types";
import { ArrowUpRight } from "lucide-react";
import { actionBarSelectedId } from "./state";

export const ActionBar = ({ panel, style }: ActionBarProps) => {
  useEffect(() => {
    actionBarPanels.set([panel]);
    if (style) actionBarStyle.set({ ...actionBarStyle.get(), ...style });
  }, [style]);
  return (
    <>
      <Hooks />
      <Dialog>
        <Top />
        <Divider />
        <Middle />
        <Divider />
        <Bottom />
      </Dialog>
    </>
  );
};

const Divider = () => {
  const s = useActionBarStyle();
  return <div style={{ backgroundColor: s.borderColor }} className="h-[1px] w-full"></div>;
};

const Dialog = ({ children }: { children: ReactNode }) => {
  const open = useStore(actionBarOpen);
  const s = useActionBarStyle();
  return (
    <div
      id="actionbar"
      style={{
        colorScheme: s.colorScheme,
        backgroundColor: s.shadowColor,
        display: open ? "flex" : "none",
      }}
      className="fixed left-0 top-0 z-50 h-screen w-screen items-start justify-center pt-[10vh] backdrop-blur-sm duration-150 md:p-4 md:pt-[25vh]"
      onClick={() => actionBarOpen.set(false)}
    >
      <div
        id="actionbar-content"
        style={{
          maxHeight: s.maxHeight,
          maxWidth: s.maxWidth,
          backgroundColor: s.backgroundColor,
          color: s.textColor,
          borderColor: s.borderColor,
          borderRadius: 16 * s.roundness,
          height: s.fullHeight ? "100%" : undefined,
        }}
        className="flex w-full flex-col overflow-hidden border border-solid"
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
  const s = useActionBarStyle();
  useEffect(() => inputRef.current?.focus(), [open]);
  return (
    <div id="actionbar-top" className="flex items-center gap-2 p-4 text-[18px]">
      {panels
        .filter((panel) => panel.name)
        .map((panel, i) => (
          <Fragment key={i}>
            <span
              onClick={() => actionBarPanels.set(panels.slice(0, i + 1))}
              style={{ outlineColor: col(s.textColor, 0.1), borderRadius: 6 * s.roundness }}
              className="cursor-pointer whitespace-nowrap p-1 hover:outline"
            >
              {panel.name}
            </span>
            <span>/</span>
          </Fragment>
        ))}
      <input
        id="actionbar-input"
        ref={inputRef}
        type="text"
        className="placeholder:text-current/60 h-full w-full border-none bg-transparent text-[18px] text-inherit focus:outline-none"
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
    <div id="actionbar-middle" className="flex h-full flex-col overflow-y-auto p-3">
      {elements.map((e) => {
        if (e.type === "section" && e.title)
          return <Section key={e.title} title={e.title} loading={e.loading} />;
        else if (e.type === "item") return <Item key={e.item.id} item={e.item} />;
      })}
    </div>
  );
};

const Bottom = () => {
  const s = useActionBarStyle();
  if (s.hideBottom) return null;
  return (
    <div
      id="actionbar-bottom"
      className="flex items-center justify-center px-4 py-1 text-xs opacity-70 md:justify-between"
    >
      <span className="py-1">
        Powered by{" "}
        <a className="text-blue-40" target="_blank" href="https://actionbar.asius.ai">
          ActionBar
        </a>
      </span>
      <div className="hidden items-center gap-4 md:flex">
        {[
          { Icon: ArrowUpDown, text: "Navigate" },
          { Icon: DeleteIcon, text: "Go back" },
          { Icon: Enter, text: "Select" },
          { Icon: CmdK, text: "Open" },
        ].map(({ Icon, text }) => (
          <div
            key={text}
            style={{ borderRadius: 6 * s.roundness }}
            className="flex items-center gap-1 p-1 duration-150"
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
    <div className="flex items-center gap-1 py-1 text-sm opacity-60">
      <span>{title}</span>
      {loading && <Loader2 className="h-3 w-3 animate-spin" />}
    </div>
  );
};

export const Item = ({ item }: { item: ActionBarInternalItem }) => {
  const selectedId = useStore(actionBarSelectedId);
  const selected = selectedId === item.id;
  const s = useActionBarStyle();

  const href = "action" in item && typeof item.action === "string" ? item.action : undefined;
  return (
    <a
      id={`actionbar-item-${item.id}`}
      onMouseMove={() => {
        if (!selected) actionBarSelectedId.set(item.id);
      }}
      style={{
        background: selected ? col(s.textColor, 0.15) : undefined,
        cursor: item.disabled ? "not-allowed" : "pointer",
        borderRadius: 6 * s.roundness,
        color: item.disabled
          ? col(s.textColor, 0.5)
          : selected
            ? s.textColor
            : col(s.textColor, 0.7),
      }}
      className="flex items-center gap-2 p-2 text-[15px] no-underline duration-150"
      onClick={href ? undefined : () => callAction(item)}
      href={href}
    >
      <div
        style={{ borderRadius: 6 * s.roundness }}
        className="flex h-5 w-5 items-center justify-center"
      >
        {item.icon || <ArrowUpRight />}
      </div>
      <span>{item.title}</span>
      <span
        style={{ opacity: selected ? 0.6 : 0, borderRadius: 6 * s.roundness }}
        className="ml-auto p-1 text-xs duration-150"
      >
        <Enter />
      </span>
    </a>
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
