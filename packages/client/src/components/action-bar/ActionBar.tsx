import { Fragment, useEffect, useRef } from "react";
import { useStore } from "@nanostores/react";
import { actionBarOpen, actionBarSearch, actionBarVisibleSections } from "./state";
import { Loader2 } from "lucide-react";
import { CheckIfSomeItemIsSelected, OpenCloseKeys, UpDownKeys } from "./hooks";
import { ActionBarSectionsInput } from "./types";
import { ActionBarItem } from "./ActionBarItem";

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
    if (items && (!oldSection?.loadingDate || oldSection?.loadingDate === loadingDate)) {
      actionBarVisibleSections.setKey(key, {
        ...section,
        items: items.map((item, i) => ({ ...item, id: item.id || `${key}-${i}` })),
        loadingDate: null,
      });
    }
  });

  await Promise.all(promises);
};

export type ActionBarProps = { sections: ActionBarSectionsInput };

export const ActionBar = ({ sections }: ActionBarProps) => {
  const open = useStore(actionBarOpen);
  const search = useStore(actionBarSearch);
  const visibleSections = useStore(actionBarVisibleSections);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => inputRef.current?.focus(), [open]);
  useEffect(() => {
    filterSections(sections, search);
  }, [sections, search]);
  console.log(visibleSections);
  return (
    <div
      style={{ colorScheme: "dark" }}
      className={`fixed left-0 top-0 h-screen w-screen items-start justify-center p-4 pt-[20vh] duration-150 ${
        open ? "flex bg-black/20" : "hidden"
      }`}
      onClick={() => actionBarOpen.set(false)}
    >
      <UpDownKeys />
      <OpenCloseKeys />
      <CheckIfSomeItemIsSelected />
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
                {section.items?.map((item, i) => <ActionBarItem key={i} item={item} />)}
              </Fragment>
            ))}
        </div>
      </div>
    </div>
  );
};
