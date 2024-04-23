/// <reference types="astro/client" />

declare namespace App {
  interface Locals {
    url: (path?: string, isAbsolute?: boolean) => string;
    locale: import("@actionbar/i18n").Locale;
    t: import("@actionbar/i18n").I18nLocale;
  }
}
