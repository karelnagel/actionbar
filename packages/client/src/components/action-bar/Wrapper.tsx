import { FileIcon } from "lucide-react";
import { ActionBar } from "./ActionBar";
import { ActionBarPanel } from "./types";
import { compare } from "./hooks";

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
const PANEL: ActionBarPanel = {
  placeholder: "What do you need?",
  sections: {
    pages: {
      title: "Pages",
      type: "static",
      items: [
        { title: "Cats", action: "/cats", Icon: FileIcon },
        { title: "Dogs", action: "/dogs" },
        { title: "Rats", action: "/rats" },
        { title: "Bats", action: "/bats" },
        { title: "Cows", action: "/cows" },
        { title: "Sheep", action: "/sheep" },
        { title: "Pigs", action: "/pigs" },
        { title: "Horses", action: "/horses" },
        { title: "Bears", action: "/bears" },
        { title: "Monkeys", action: "/monkeys" },
        { title: "Snail", action: "/snail" },
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
          title: "Weather",
          panel: {
            placeholder: "Search for country",
            name: "Weather",
            sections: {
              recommended: {
                title: "Recommended",
                type: "static",
                items: [{ title: "USA" }, { title: "UK" }, { title: "Australia" }],
              },
              countries: {
                title: "Countries",
                type: "fetch-on-search",
                items: async (search: string) => {
                  const countries = await getCountriesList(search);
                  return countries.map((country) => ({
                    title: country,
                    panel: {
                      placeholder: "Search for city",
                      name: country,
                      sections: {
                        cities: {
                          title: "Cities",
                          type: "fetch-on-search",
                          items: async (search: string) => {
                            const cities = await getCitiesList(search);
                            return cities.map((city) => ({
                              title: city,
                              panel: {
                                placeholder: "C or F",
                                name: city,
                                sections: {
                                  temp: {
                                    title: "Temperature",
                                    type: "static",
                                    items: [
                                      {
                                        title: "Celsius",
                                        action: () => {
                                          alert(
                                            `User wanted temp in ${country} ${city} in Celsius`,
                                          );
                                        },
                                      },
                                      {
                                        title: "Farenhite",
                                        action: () => {
                                          alert(`User wanted temp in ${city} in Farenhite`);
                                        },
                                      },
                                    ],
                                  },
                                },
                              },
                            }));
                          },
                        },
                      },
                    },
                  }));
                },
              },
            },
          },
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
