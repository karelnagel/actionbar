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
import { Hooks, callAction } from "./hooks";
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
  const style = useActionBarStyle();
  return <div style={{ backgroundColor: style.borderColor }} className="h-[1px] w-full"></div>;
};

const Dialog = ({ children }: { children: ReactNode }) => {
  const open = useStore(actionBarOpen);
  const style = useActionBarStyle();
  return (
    <div
      style={{
        colorScheme: style.colorScheme,
        backgroundColor: style.shadowColor,
        display: open ? "flex" : "none",
        paddingTop: `${style.paddingTop}vh`,
      }}
      className={`fixed left-0 top-0 h-screen w-screen items-start justify-center p-4 duration-150`}
      onClick={() => actionBarOpen.set(false)}
    >
      <div
        style={{
          maxHeight: style.maxHeight,
          maxWidth: style.maxWidth,
          backgroundColor: style.backgroundColor,
          color: style.textColor,
          borderColor: style.borderColor,
        }}
        className="flex h-full w-full flex-col overflow-hidden rounded-2xl border"
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
    <div className="flex items-center gap-2 p-4 text-[18px]">
      {panels
        .filter((panel) => panel.name)
        .map((panel, i) => (
          <Fragment key={i}>
            <span
              onClick={() => actionBarPanels.set(panels.slice(0, i + 1))}
              style={{ outlineColor: col(s.textColor, 0.1) }}
              className="cursor-pointer whitespace-nowrap rounded-md p-1 hover:outline"
            >
              {panel.name}
            </span>
            <span>/</span>
          </Fragment>
        ))}
      <input
        ref={inputRef}
        type="text"
        className="placeholder:text-current/60 w-full bg-transparent focus:outline-none"
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
    <div className="flex w-full items-center justify-between px-4 py-1 text-xs opacity-70">
      <p>
        Powered by{" "}
        <a className="text-blue-400" target="_blank" href="https://actionbar.asius.ai">
          ActionBar
        </a>
      </p>
      <div className="flex items-center gap-4">
        {[
          { Icon: ArrowUpDown, text: "Navigate" },
          { Icon: DeleteIcon, text: "Go back" },
          { Icon: Enter, text: "Select" },
          { Icon: CmdK, text: "Open" },
        ].map(({ Icon, text }) => (
          <div key={text} className="flex items-center gap-1 rounded-md p-1 duration-150">
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
      <p>{title}</p>
      {loading && <Loader2 className="h-3 w-3 animate-spin" />}
    </div>
  );
};

export const Item = ({ item }: { item: ActionBarInternalItem }) => {
  const selectedId = useStore(actionBarSelectedId);
  const selected = selectedId === item.id;
  const style = useActionBarStyle();
  return (
    <div
      id={item.id}
      onMouseEnter={() => actionBarSelectedId.set(item.id)}
      style={{
        background: selected ? col(style.textColor, 0.15) : undefined,
        cursor: item.disabled ? "not-allowed" : "pointer",
        color: item.disabled
          ? col(style.textColor, 0.5)
          : selected
            ? style.textColor
            : col(style.textColor, 0.7),
      }}
      className="flex items-center gap-2 rounded-md p-2 text-[15px] duration-150"
      onClick={() => callAction(item)}
    >
      <div className="flex h-5 w-5 items-center justify-center rounded-md">
        {item.icon || <ArrowUpRight />}
      </div>
      <span>{item.title}</span>
      <span
        style={{ opacity: selected ? 0.6 : 0 }}
        className="ml-auto rounded-md  p-1 text-xs duration-150"
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
