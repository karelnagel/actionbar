import { useStore } from "@nanostores/react";
import { actionBarAIInput, actionBarAIMessages, actionBarAIOpen } from "./state";
import { cn } from "./helpers";
import { X } from "lucide-react";

export const Chat = () => {
  const open = useStore(actionBarAIOpen);
  const input = useStore(actionBarAIInput);
  const messages = useStore(actionBarAIMessages);

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
          <div
            className="flex w-full cursor-pointer items-center justify-between border-b p-3 py-2 text-lg"
            onClick={() => actionBarAIOpen.set(false)}
          >
            <p>AI Assistant</p>
            <X className="h-5 w-5" />
          </div>
          <div className="flex h-full w-full flex-col-reverse gap-2 overflow-y-auto p-2 text-sm text-white">
            {messages
              .slice()
              .reverse()
              .map((message, i) => (
                <div key={i} className="flex">
                  <div
                    className={cn(
                      "max-w-[80%] rounded-2xl p-2",
                      message.role === "user" ? "ml-auto bg-blue-600" : "bg-slate-700",
                    )}
                  >
                    {message.content}
                  </div>
                </div>
              ))}
          </div>
          <form
            className="flex gap-2 border-t p-2"
            onSubmit={(e) => {
              e.preventDefault();
              actionBarAIMessages.set([...messages, { role: "user", content: input }]);
              actionBarAIInput.set("");
            }}
          >
            <input
              value={input}
              onChange={(e) => actionBarAIInput.set(e.target.value)}
              className="w-full rounded-md border p-[1px] px-1 text-sm"
            />
            <button type="submit" className="rounded-lg bg-blue-600 px-2 py-1 text-white">
              Send
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
