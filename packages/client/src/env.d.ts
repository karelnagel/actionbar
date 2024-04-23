/// <reference types="astro/client" />

declare namespace App {
  interface Locals {
    url: (path?: string, isAbsolute?: boolean) => string;
    locale: import("@template/i18n").Locale;
    t: import("@template/i18n").I18nLocale;
  }
}
