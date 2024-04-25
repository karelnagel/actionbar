import { CatIcon, DogIcon, FlagIcon, HomeIcon, SunIcon, ThermometerIcon } from "lucide-react";
import { ActionBar } from "./ActionBar";
import { ActionBarPanel } from "./types";
import { compare } from "./hooks";
import { MoonIcon } from "lucide-react";
import { toast } from "sonner";

const CITIES = {
  Tallinn: { lat: 64.950031, lng: 24.12444, flag: "https://flagcdn.com/w40/ee.png" },
  Helsinki: { lat: 60.169856, lng: 24.938379, flag: "https://flagcdn.com/w40/fi.png" },
  Stockholm: { lat: 59.329325, lng: 18.068581, flag: "https://flagcdn.com/w40/se.png" },
  Riga: { lat: 56.94965, lng: 24.105181, flag: "https://flagcdn.com/w40/lv.png" },
  Warsaw: { lat: 52.237049, lng: 21.012239, flag: "https://flagcdn.com/w40/pl.png" },
  Berlin: { lat: 52.520833, lng: 13.409722, flag: "https://flagcdn.com/w40/de.png" },
  Paris: { lat: 48.856667, lng: 2.352222, flag: "https://flagcdn.com/w40/fr.png" },
  Madrid: { lat: 40.416775, lng: -3.70379, flag: "https://flagcdn.com/w40/es.png" },
  London: { lat: 51.507351, lng: -0.127621, flag: "https://flagcdn.com/w40/gb.png" },
  NewYork: { lat: 40.712776, lng: -74.005974, flag: "https://flagcdn.com/w40/us.png" },
};

const findCountry = async (
  search: string,
): Promise<{ name: { common: string }; flags: { svg: string } }[]> => {
  try {
    const res = await fetch(`https://restcountries.com/v3.1/name/${search}`).then((x) => x.json());
    if (res.status === 404) {
      return [];
    }
    return res;
  } catch (e) {
    console.log(e);
    return [];
  }
};
const getTemp = async (lat: number, lng: number, degrees: string): Promise<number> => {
  const res = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&hourly=temperature_2m&temperature_unit=${degrees === "Celsius" ? "celsius" : "fahrenheit"}`,
  ).then((x) => x.json());
  return res.hourly.temperature_2m[0];
};

const degreesPanel = (city: string): ActionBarPanel => {
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
            const { lat, lng } = CITIES[city as keyof typeof CITIES];
            const temp = await getTemp(lat, lng, degrees);
            toast(`${city} temperature is ${temp} ${degrees}`);
          },
        })),
      },
    },
  };
};

const citiesPanel: ActionBarPanel = {
  placeholder: "Search for city",
  name: "Weather",
  sections: {
    recommended: {
      title: "Recommended",
      type: "static",
      items: ["Paris", "Madrid", "NewYork"].map((city) => ({
        title: city,
        icon: <img src={CITIES[city as keyof typeof CITIES].flag} />,
        panel: degreesPanel(city),
      })),
    },
    countries: {
      title: "Countries",
      type: "fetch-on-search",
      items: async (search: string) => {
        const cities = Object.entries(CITIES).filter(([city]) => compare(city, search));
        return cities.map(([city, { flag }]) => ({
          title: city,
          icon: <img src={flag} />,
          panel: degreesPanel(city),
        }));
      },
    },
  },
};

const PANEL: ActionBarPanel = {
  placeholder: "Search for countries",
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
      ],
    },
    search: {
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
  },
};

export const ActionBarWrapper = () => {
  return <ActionBar panel={PANEL} />;
};
