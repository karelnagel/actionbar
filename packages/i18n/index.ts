import { en, type I18nLocale } from "./en";
import { et } from "./et";
import z from "zod";

export const Locale = z.enum(["en", "et"]);
export type Locale = z.infer<typeof Locale>;

export const DEFAULT_LOCALE: Locale = "en";

const TRANSLATIONS: { [key in Locale]: I18nLocale } = {
  et,
  en,
};
export const LocalePaths = Locale.options.map((locale) => ({
  params: { locale },
}));

export const useTranslations = (locale: Locale | undefined) => {
  return TRANSLATIONS[locale || DEFAULT_LOCALE];
};

export type { I18nLocale } from "./en";

export const LocaleInfo = {
  en: {
    title: "English",
  },
  et: {
    title: "Eesti",
  },
};
