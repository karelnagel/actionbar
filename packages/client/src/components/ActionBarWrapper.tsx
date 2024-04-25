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
import { ActionBar, type ActionBarPanel } from "@actionbar/react";
import { MoonIcon } from "lucide-react";
import { toast } from "sonner";

type Country = {
  name: { common: string };
  flags: { svg: string };
  capital: [string];
  capitalInfo: {
    latlng: [number, number];
  };
};

const findCountry = async (search: string): Promise<Country[]> => {
  try {
    const res = await fetch(`https://restcountries.com/v3.1/name/${search}`);
    if (res.status === 404) return [];
    return res.json();
  } catch (e) {
    return [];
  }
};

const findCapital = async (search: string): Promise<Country[]> => {
  try {
    const res = await fetch(`https://restcountries.com/v3.1/capital/${search}`);
    if (res.status === 404) return [];
    return res.json();
  } catch (e) {
    return [];
  }
};

const getTemp = async (lat: number, lng: number, degrees: string): Promise<number> => {
  const res = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&hourly=temperature_2m&temperature_unit=${degrees === "Celsius" ? "celsius" : "fahrenheit"}`,
  ).then((x) => x.json());
  return res.hourly.temperature_2m[0];
};

const degreesPanel = (city: string, lat: number, lng: number): ActionBarPanel => {
  return {
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
  };
};

const citiesPanel: ActionBarPanel = {
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
      items: [
        {
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
        },
        {
          title: "Current weather",
          icon: <ThermometerIcon />,
          panel: citiesPanel,
        },
        {
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
        },
      ],
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
        if (!search.length) return [{ title: "Start typing to search for capitals", icon: <Building2Icon /> }];
        const res = await findCapital(search);
        console.log(res);
        return res.map((x) => ({
          title: x.capital[0],
          action: `/${x.capital[0]}`,
          icon: <img src={x.flags.svg} />,
        }));
      },
    },
  },
};

export const ActionBarWrapper = () => {
  return <ActionBar panel={PANEL} />;
};
