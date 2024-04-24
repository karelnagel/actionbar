import { FileIcon } from "lucide-react";
import { ActionBar, ActionBarSectionsInput } from "./ActionBar";

const SECTIONS: ActionBarSectionsInput = {
  blog: {
    title: "Blog",
    type: "static",
    items: [
      { title: "Cats", href: "/cats", Icon: FileIcon },
      { title: "Dogs", href: "/dogs" },
      { title: "Rats", href: "/rats" },
      { title: "Bats", href: "/bats" },
    ],
  },
  actions: {
    title: "Actions",
    type: "static",
    items: [
      {
        title: "Change theme",
        action: () => {
          document.body.classList.toggle("dark");
          alert("changed");
        },
      },
      {
        title: "Get weather",
        action: () => {
          fetch(
            "https://api.openweathermap.org/data/2.5/weather?q=London,uk&appid=b6907d289e10d71b81512d96756a52552",
          )
            .then((res) => res.json())
            .then((data) => {
              alert(JSON.stringify(data));
            });
        },
      },
    ],
  },
  search: {
    title: "Search",
    type: "fetch-on-search",
    items: async (search: string) => {
      if (search.length < 2) return [];

      await new Promise((resolve) => setTimeout(resolve, 2000));
      return [{ title: `Searched for ${search}, it has ${search.length} letters` }];
    },
  },
};

export const ActionBarWrapper = () => {
  return <ActionBar sections={SECTIONS} />;
};
