import {
  Building2Icon,
  CatIcon,
  DogIcon,
  FlagIcon,
  HomeIcon,
  MailIcon,
  SunIcon,
  ThermometerIcon,
  XIcon,
} from "lucide-react";
import { ActionBar, type ActionBarPanel, type ActionBarItem } from "../../../actionbar/src/index";
import { MoonIcon } from "lucide-react";
import { toast } from "sonner";
import { findCountry, findCapital, getTemp } from "./countries";
import { client } from "../trpc/client";

const degreesPanel = (city: string, lat: number, lng: number): ActionBarPanel => ({
  placeholder: "Show temperature in",
  name: city,
  sections: {
    temp: {
      title: "Temperature",
      type: "static",
      items: ["Celsius", "Farenhite"].map((degrees) => ({
        title: degrees,
        icon: <p className="font-bold text-blue-500">{degrees.slice(0, 1).toUpperCase()}</p>,
        action: async () => {
          const temp = await getTemp(lat, lng, degrees);
          toast(`${city} temperature is ${temp} ${degrees}`);
        },
      })),
    },
  },
});

const WEATHER: ActionBarItem = {
  title: "Current weather",
  icon: <ThermometerIcon />,
  panel: {
    placeholder: "Search for a country or capital",
    name: "Weather",
    sections: {
      countries: {
        title: "Countries",
        type: "fetch-on-search",
        debounce: 500,
        items: async (search: string) => {
          if (!search.length) return [];
          const countries = await findCountry(search);
          return countries.map((x) => ({
            title: x.name.common,
            icon: <img src={x.flags.svg} />,
            panel: degreesPanel(x.name.common, x.capitalInfo.latlng[0], x.capitalInfo.latlng[1]),
          }));
        },
      },
      capitals: {
        title: "Capitals",
        type: "fetch-on-search",
        items: async (search: string) => {
          if (!search.length) return [];
          const capitals = await findCapital(search);
          return capitals.map((x) => ({
            title: x.capital[0],
            icon: <img src={x.flags.svg} />,
            panel: degreesPanel(x.capital[0], x.capitalInfo.latlng[0], x.capitalInfo.latlng[1]),
          }));
        },
      },
    },
  },
};

const CONTACT: ActionBarItem = {
  title: "Contact us",
  icon: <MailIcon />,
  panel: {
    name: "Contact",
    placeholder: "Type your email",
    sections: {
      options: {
        type: "fetch-on-search",
        items: async (email: string) => {
          const isValid = email.includes("@");
          return [
            {
              title: isValid ? "Go forward" : "Invalid email",
              icon: isValid ? <MailIcon /> : <XIcon />,
              disabled: !isValid,
              panel: {
                placeholder: "Type your message",
                name: email,
                sections: {
                  message: {
                    type: "fetch-on-search",
                    items: async (search: string) => {
                      const isValid = search.length > 0;
                      return [
                        {
                          title: "Send message",
                          disabled: !isValid,
                          icon: <MailIcon />,
                          action: ({ search }) => {
                            toast(`Sending message: ${search} from ${email}`);
                          },
                        },
                      ];
                    },
                  },
                },
              },
            },
          ];
        },
      },
    },
  },
};

const THEME: ActionBarItem = {
  title: "Change theme",
  icon: <SunIcon />,
  panel: {
    name: "Theme",
    placeholder: "Select theme",
    sections: {
      themes: {
        title: "Themes",
        type: "static",
        items: [
          { title: "Light", icon: <SunIcon /> },
          { title: "Dark", icon: <MoonIcon /> },
        ].map((x) => ({
          ...x,
          action: () => {
            document.body.classList.toggle(x.title.toLowerCase());
            toast(`Changed theme to ${x.title}`);
          },
        })),
      },
    },
  },
};

const PANEL: ActionBarPanel = {
  placeholder: "Search for a country or a capital",
  sections: {
    pages: {
      title: "Pages",
      type: "static",
      items: [
        { title: "Home", action: "/home", icon: <HomeIcon /> },
        { title: "Cats", action: "/cats", icon: <CatIcon /> },
        { title: "Dogs", action: "/dogs", icon: <DogIcon /> },
      ],
    },
    actions: {
      title: "Actions",
      type: "static",
      items: [THEME, WEATHER, CONTACT],
    },
    countries: {
      title: "Country search",
      type: "fetch-on-search",
      debounce: 500,
      items: async (search: string) => {
        if (!search.length)
          return [{ title: "Start typing to search for countries", icon: <FlagIcon /> }];
        const res = await findCountry(search);
        return res.map((x) => ({
          title: x.name.common,
          action: `/${x.name.common}`,
          icon: <img src={x.flags.svg} />,
        }));
      },
    },
    capitals: {
      title: "Capitals",
      type: "fetch-on-search",
      debounce: 500,
      items: async (search: string) => {
        if (!search.length)
          return [{ title: "Start typing to search for capitals", icon: <Building2Icon /> }];
        const res = await findCapital(search);
        return res.map((x) => ({
          title: x.capital[0],
          action: `/${x.capital[0]}`,
          icon: <img src={x.flags.svg} />,
        }));
      },
    },
    search: {
      title: "Search",
      type: "fetch-on-search",
      debounce: 500,
      items: async (search: string) => {
        if (!search.length) return [];
        const res = await client.search.search.mutate({ q: search });
        return res.items.map((x) => ({
          title: x.title,
          action: x.sourceUrl,
          description: x.text,
        }));
      },
    },
  },
};

export const ActionBarWrapper = () => {
  return <ActionBar panel={PANEL} style={{}} />;
};
