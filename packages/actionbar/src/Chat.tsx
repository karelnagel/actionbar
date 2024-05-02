import { useStore } from "@nanostores/react";
import { actionBarAIInput, actionBarAIMessages, actionBarAIOpen } from "./state";
import { cn } from "./helpers";
import { X } from "lucide-react";
import Markdown from "react-markdown";
import { useCallback } from "react";

export const Chat = () => {
  const open = useStore(actionBarAIOpen);

  return (
    <div
      onClick={() => actionBarAIOpen.set(!open)}
      className={cn(
        "fixed bottom-10 right-10 flex cursor-pointer items-center justify-center overflow-hidden rounded-[28px] bg-slate-700 p-2 duration-500",
        open ? "h-[600px] w-80" : "h-14 w-14",
      )}
    >
      {!open && <div>AI</div>}
      {open && (
        <div
          className="flex h-full w-full cursor-default flex-col rounded-[23px] bg-white text-black"
          onClick={(e) => e.stopPropagation()}
        >
          <Top />
          <Messages />
          <Input />
        </div>
      )}
    </div>
  );
};

const Top = () => {
  return (
    <div
      className="flex w-full cursor-pointer items-center justify-between border-b p-3 py-2 text-lg"
      onClick={() => actionBarAIOpen.set(false)}
    >
      <p>AI Assistant</p>
      <X className="h-5 w-5" />
    </div>
  );
};

const Messages = () => {
  const messages = useStore(actionBarAIMessages);
  return (
    <div className="flex h-full w-full flex-col-reverse gap-2 overflow-y-auto overflow-x-hidden p-2 text-sm text-white">
      {messages
        .slice()
        .reverse()
        .map((message, i) => (
          <div key={i} className="flex">
            <div
              className={cn(
                "max-w-[90%] rounded-2xl p-2",
                message.role === "user" ? "ml-auto bg-blue-600" : "bg-slate-700",
              )}
            >
              <Markdown
                components={{
                  a: ({ node, ...props }) => (
                    <a {...props} target="_blank" rel="noreferrer" className="text-red-400" />
                  ),
                }}
              >
                {message.content}
              </Markdown>
            </div>
          </div>
        ))}
    </div>
  );
};

const Input = () => {
  const input = useStore(actionBarAIInput);
  const submit = useCallback(() => {
    actionBarAIMessages.set([...actionBarAIMessages.get(), { role: "user", content: input }]);
    actionBarAIInput.set("");
  }, [input]);
  return (
    <form
      className="flex items-center gap-2 border-t p-2"
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
          e.preventDefault();
          submit();
        }
      }}
    >
      <textarea
        value={input}
        onChange={(e) => actionBarAIInput.set(e.target.value)}
        className="w-full resize-none rounded-md border p-1 text-sm"
        rows={Math.min(input.split("\n").length, 4)}
      />
      <button type="submit" className="rounded-lg bg-blue-600 px-2 py-1 text-white">
        Send
      </button>
    </form>
  );
};
