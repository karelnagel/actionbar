import { useEffect } from "react";
import { useStore } from "@nanostores/react";
import { actionBarOpen, actionBarSearch } from "./state";

export const useKeyboardShortcuts = () => {
  useEffect(() => {
    const down = (e: any) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        actionBarOpen.set(!actionBarOpen.get());
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);
};

export const ActionBar = () => {
  const open = useStore(actionBarOpen);
  const search = useStore(actionBarSearch);
  useKeyboardShortcuts();

  return (
    <div
      style={{ display: open ? "flex" : "none" }}
      className="absolute left-0 top-0 h-full w-full items-center justify-center"
      onClick={() => actionBarOpen.set(false)}
    >
      <div className="rounded-md bg-blue-300 p-10 " onClick={(e) => e.stopPropagation()}>
        <input type="text" value={search} onChange={(e) => actionBarSearch.set(e.target.value)} />
      </div>
    </div>
  );
};
