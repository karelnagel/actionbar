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

export const getPage = async (href: string) => {
  const url = new URL(href);
  const res = await fetch(url).then((res) => res.text());
  const $ = cheerio.load(res);
  $("script").remove();
  const title = $("title").text() || "";
  const description = $("meta[name=description]").attr("content") || "";
  const html = $("body").html() || "";
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
  const markdown = converter.turndown(html);
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 512,
    chunkOverlap: 40,
  });
  const output = await splitter.createDocuments([markdown]);
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

fs.mkdirSync("out", { recursive: true });
getPage("https://wolfagency.ee/").then((x) => fs.writeFileSync("out/wolfagency.md", x.markdown));
getPage("https://asius.ai").then((x) => fs.writeFileSync("out/asius.md", x.markdown));
getPage("https://astro.build").then((x) => fs.writeFileSync("out/astro.md", x.markdown));
getPage("https://ion.sst.dev/docs/component/aws/astro/").then((x) =>
  fs.writeFileSync("out/ion.md", x.markdown),
);
getPage("https://www.framer.com/").then((x) => fs.writeFileSync("out/framer.md", x.markdown));
