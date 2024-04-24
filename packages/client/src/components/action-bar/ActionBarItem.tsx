import { useStore } from "@nanostores/react";
import { ArrowUpRight } from "lucide-react";
import { useCallback, useEffect } from "react";
import { actionBarSelectedId, actionBarOpen } from "./state";
import type { ActionBarItem as ItemType } from "./types";

export type ActionBarItemProps = {
  item: ItemType;
};

export const ActionBarItem = ({ item }: ActionBarItemProps) => {
  const selectedId = useStore(actionBarSelectedId);
  const selected = selectedId === item.id;
  const action = useCallback(() => {
    if (item.action) item.action();
    if (item.href) window.location.href = item.href;
  }, [item]);

  useEffect(() => {
    const listenToEnter = (e: any) => {
      if (selected && actionBarOpen.get() && e.key === "Enter") action();
    };
    document.addEventListener("keydown", listenToEnter);
    return () => document.removeEventListener("keydown", listenToEnter);
  }, [selected, action]);

  const Icon = item.Icon || ArrowUpRight;
  return (
    <div
      id={item.id}
      onMouseEnter={() => actionBarSelectedId.set(item.id)}
      className={`${selected ? "bg-white/10 text-white" : "text-white/70"} flex cursor-pointer items-center gap-2 rounded-md p-2 text-[15px] duration-150`}
      onClick={action}
    >
      <Icon className={`h-5 w-5 rounded-md `} />
      <span>{item.title}</span>
      <span
        className={`${selected ? "opacity-60" : "opacity-0"} ml-auto rounded-md  p-1 text-xs duration-150`}
      >
        {item.cta || "Go to"}
      </span>
    </div>
  );
};
