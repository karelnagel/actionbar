import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import * as cheerio from "cheerio";
import fs from "fs";
import TurndownService from "turndown";

export const getPagesFromSitemap = async (url: string): Promise<string[]> => {
  const res = await fetch(url);
  const map = await res.text();
  const sites = map
    .split("<loc>")
    .map((site) => site.split("</loc>")[0]!.trim())
    .slice(1);
  return sites;
};

const htmlToMd = (html: string, url: URL) => {
  const converter = new TurndownService({
    headingStyle: "atx",
    fence: "```",
    linkStyle: "inlined",
    codeBlockStyle: "fenced",
    defaultReplacement: (content) => {
      const origin = url.origin;
      const res = content
        .replaceAll(/\((?!https:\/\/)/g, `(${origin}/`)
        .replace(/([^:]\/)\/+/g, "$1");
      return res;
    },
  });
  return converter.turndown(html);
};

const splitText = async (text: string) => {
  const splitter = new RecursiveCharacterTextSplitter({ chunkSize: 512, chunkOverlap: 40 });
  return await splitter.createDocuments([text]);
};

export const getPage = async (href: string) => {
  const url = new URL(href);
  const res = await fetch(url).then((res) => res.text());
  const $ = cheerio.load(res);
  $("script").remove();
  $("style").remove();
  $("link").remove();
  $("meta").remove();
  $("iframe").remove();
  $("noscript").remove();
  const title = $("title").text() || "";
  const description = $("meta[name=description]").attr("content") || "";
  const markdown = htmlToMd($("body").html() || "", url);
  const output = await splitText(markdown);
  return {
    markdown,
    texts: output.map((doc) => doc.pageContent),
    title,
    description,
  };
};

export const indexSite = async (url: string) => {
  const sites = await getPagesFromSitemap(url);
  console.log(sites);
  const indexed: { url: string; title: string; description: string; texts: string[] }[] = [];
  for (const site of sites) {
    const content = await getPage(site);
    indexed.push({ url: site, ...content });
  }
  return indexed;
};

const path = "out";
fs.mkdirSync(path, { recursive: true });
getPage("https://wolfagency.ee/").then((x) =>
  fs.writeFileSync(`${path}/wolfagency.md`, x.markdown),
);
getPage("https://asius.ai").then((x) => fs.writeFileSync(`${path}/asius.md`, x.markdown));
getPage("https://astro.build").then((x) => fs.writeFileSync(`${path}/astro.md`, x.markdown));
getPage("https://ion.sst.dev/docs/component/aws/astro/").then((x) =>
  fs.writeFileSync(`${path}/ion.md`, x.markdown),
);
getPage("https://www.framer.com/").then((x) => fs.writeFileSync(`${path}/framer.md`, x.markdown));
