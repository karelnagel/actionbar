import { CatIcon, DogIcon, HomeIcon, SunIcon } from "lucide-react";
import { ActionBar } from "./ActionBar";
import { ActionBarPanel } from "./types";
import { compare } from "./hooks";
import { MoonIcon } from "lucide-react";
const getCountriesList = async (search: string) => {
  return [
    "Estonia",
    "Finland",
    "Sweden",
    "Lithuania",
    "Poland",
    "Germany",
    "France",
    "Spain",
    "UK",
    "USA",
  ].filter((x) => compare(x, search));
};
const getCitiesList = async (search: string) => {
  return [
    "Tallinn",
    "Helsinki",
    "Stockholm",
    "Riga",
    "Warsaw",
    "Berlin",
    "Paris",
    "Madrid",
    "London",
    "New York",
  ].filter((x) => compare(x, search));
};

const degreesPanel = (country: string, city: string): ActionBarPanel => {
  return {
    placeholder: "Show temperature in",
    name: city,
    sections: {
      temp: {
        title: "Temperature",
        type: "static",
        items: ["Celsius", "Farenhite"].map((x) => ({
          title: x,
          action: () => {
            alert(`User wanted temp in ${country} ${city} in ${x}`);
          },
        })),
      },
    },
  };
};

const citiesPanel = (country: string): ActionBarPanel => {
  return {
    placeholder: "Search for city",
    name: country,
    sections: {
      cities: {
        title: "Cities",
        type: "fetch-on-search",
        items: async (search: string) => {
          const cities = await getCitiesList(search);
          return cities.map((city) => ({ title: city, panel: degreesPanel(country, city) }));
        },
      },
    },
  };
};

const countriesPanel: ActionBarPanel = {
  placeholder: "Search for country",
  name: "Weather",
  sections: {
    recommended: {
      title: "Recommended",
      type: "static",
      items: ["USA", "UK", "Estonia"].map((x) => ({ title: x, panel: citiesPanel(x) })),
    },
    countries: {
      title: "Countries",
      type: "fetch-on-search",
      items: async (search: string) => {
        const countries = await getCountriesList(search);
        return countries.map((country) => ({ title: country, panel: citiesPanel(country) }));
      },
    },
  },
};

const PANEL: ActionBarPanel = {
  placeholder: "What do you need?",
  sections: {
    pages: {
      title: "Pages",
      type: "static",
      items: [
        { title: "Home", action: "/home", Icon: HomeIcon },
        { title: "Cats", action: "/cats", Icon: CatIcon },
        { title: "Dogs", action: "/dogs", Icon: DogIcon },
      ],
    },
    actions: {
      title: "Actions",
      type: "static",
      items: [
        {
          title: "Change theme",
          panel: {
            name: "Theme",
            placeholder: "Select theme",
            sections: {
              themes: {
                title: "Themes",
                type: "static",
                items: [
                  { title: "Light", Icon: SunIcon },
                  { title: "Dark", Icon: MoonIcon },
                ].map((x) => ({
                  ...x,
                  action: () => {
                    document.body.classList.toggle(x.title.toLowerCase());
                    alert(`Changed theme to ${x.title}`);
                  },
                })),
              },
            },
          },
        },
        {
          title: "Current weather",
          panel: countriesPanel,
        },
      ],
    },
    search: {
      title: "Search",
      type: "fetch-on-search",
      debounce: 300,
      items: async (search: string) => {
        if (search.length < 2) return [];
        console.log("this fn should only be executed at the end");
        await new Promise((resolve) => setTimeout(resolve, 2000));
        return [
          {
            title: `Searched for ${search}, it has ${search.length} letters`,
            action: () => {
              alert(search);
            },
          },
        ];
      },
    },
  },
};

export const ActionBarWrapper = () => {
  return <ActionBar panel={PANEL} />;
};
