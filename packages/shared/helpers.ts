import { v4 as uuidv4 } from "uuid";
import { Locale } from "@template/i18n";
import { SITE } from "./consts";

export const getRandomId = () => uuidv4();

export const getPathname = (path: string) => {
  const regex = new RegExp(`^/(${Locale.options.join("|")})`);
  return path.replace(regex, "");
};

export const getLocaleUrl = (locale: Locale, path?: string, isAbsolute = false) => {
  const pathname = path?.startsWith("/") ? path : `/${path || ""}`;
  if (isAbsolute) return `${SITE}/${locale}${pathname}`;
  return `/${locale}${pathname}`;
};
