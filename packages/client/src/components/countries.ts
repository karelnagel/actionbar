type Country = {
  name: { common: string };
  flags: { svg: string };
  capital: [string];
  capitalInfo: {
    latlng: [number, number];
  };
};

export const findCountry = async (search: string): Promise<Country[]> => {
  try {
    const res = await fetch(`https://restcountries.com/v3.1/name/${search}`);
    if (res.status === 404) return [];
    return res.json();
  } catch (e) {
    return [];
  }
};

export const findCapital = async (search: string): Promise<Country[]> => {
  try {
    const res = await fetch(`https://restcountries.com/v3.1/capital/${search}`);
    if (res.status === 404) return [];
    return res.json();
  } catch (e) {
    return [];
  }
};

export const getTemp = async (lat: number, lng: number, degrees: string): Promise<number> => {
  const res = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&hourly=temperature_2m&temperature_unit=${degrees === "Celsius" ? "celsius" : "fahrenheit"}`,
  ).then((x) => x.json());
  return res.hourly.temperature_2m[0];
};
