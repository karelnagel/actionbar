import { atom, computed, map } from "nanostores";
import {
  ActionBarInternalElement,
  ActionBarPanel,
  ActionBarInternalSection,
  ActionBarStyle,
} from "./types";
import { useStore } from "@nanostores/react";
import { z } from "zod";
import axios from "axios";

export const col = (hex: string, opacity: number) => hex + Math.round(opacity * 255).toString(16);

export const actionBarStyle = atom<ActionBarStyle>({
  backgroundColor: "#121212",
  shadowColor: col("#121212", 0.2),
  borderColor: col("#FFFFFF", 0.15),
  textColor: "#FFFFFF",
  maxHeight: 450,
  maxWidth: 700,
  colorScheme: "dark",
  paddingTop: 20,
  roundness: 1,
  hideBottom: false,
  fullHeight: false,
});
export const useActionBarStyle = () => useStore(actionBarStyle);

export const actionBarOpen = atom(false);
export const actionBarSearch = atom("");
export const actionBarSelectedId = atom<string | null>(null);

export const actionBarPanels = atom<ActionBarPanel[]>([]);
export const actionBarCurrentPanel = computed(
  actionBarPanels,
  (panels) => panels[panels.length - 1],
);

actionBarOpen.listen(() => {
  const panels = actionBarPanels.get();
  if (panels.length > 1) actionBarPanels.set(panels.slice(0, 1));
  actionBarSearch.set("");
});

export const actionBarVisibleSections = map<Record<string, ActionBarInternalSection>>({});

export const actionBarElements = computed(actionBarVisibleSections, (sections) => {
  const elements: ActionBarInternalElement[] = Object.values(sections)
    .filter((section) => section.loadingDate !== null || section.items.length)
    .flatMap((section) => [
      { type: "section", title: section.title, loading: section.loadingDate !== null },
      ...(section.items.map((item) => ({ type: "item" as const, item })) || []),
    ]);
  return elements;
});

export const actionBarItems = computed(actionBarElements, (elements) => {
  return elements.filter((x) => x.type === "item").map((x) => (x.type === "item" ? x.item : null)!);
});

export const actionBarSelectedItem = computed(
  [actionBarSelectedId, actionBarItems],
  (selectedId, items) => {
    return items.find((x) => x.id === selectedId);
  },
);

export const actionBarAIOpen = atom(true);
export const Message = z.object({
  role: z.enum(["user", "assistant", "system"]),
  content: z.string(),
});
export type Message = z.infer<typeof Message>;

export const actionBarAIMessages = atom<Message[]>([
  { role: "assistant", content: "Hi! How can I help you?" },
]);

export const actionBarAIInput = atom("");

actionBarAIMessages.listen(async (messages, oldValue) => {
  const messageId = messages.length;
  if (oldValue.length === messages.length || messages[messageId - 1]?.role !== "user") return;

  actionBarAIMessages.set([...messages, { role: "assistant", content: "Loading..." }]);

  const res = await axios.post("/api/chat", { messages });

  actionBarAIMessages.set(
    actionBarAIMessages.get().map((x, i) => (i === messageId ? Message.parse(res.data) : x)),
  );
});
