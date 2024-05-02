import { Browser } from "puppeteer";
import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import { load } from "cheerio";

type HTML = {
  html: string;
  title: string;
  description: string;
  status: number;
};

export const getPageWithFetch = async (url: URL): Promise<HTML> => {
  const res = await fetch(url);
  const status = res.status;
  const text = await res.text();
  const $ = load(text);
  const title = $("title").text() || "";
  const description = $("meta[name=description]").attr("content") || "";
  const html = $("body").html() || "";
  return { html, title, description, status };
};

export let browser: Browser | undefined;

export const getPageWithPuppeteer = async (url: URL): Promise<HTML> => {
  puppeteer.use(StealthPlugin());
  if (!browser) {
    browser = await puppeteer.launch({ headless: "new" });
  }
  const page = await browser.newPage();
  const res = await page.goto(url.toString());
  const status = res?.status() || 600;
  const title = await page.title();
  const description = "";
  const html = await page.content();
  return { html, title, description, status };
};
