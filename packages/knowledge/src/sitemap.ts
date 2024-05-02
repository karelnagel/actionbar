import { MarkdownTextSplitter } from "langchain/text_splitter";
import fs from "fs";
import { htmlToMD } from "./html-to-md";
import { browser, getPageWithPuppeteer } from "./get-html";

export const getPagesFromSitemap = async (url: string): Promise<string[]> => {
  const res = await fetch(url);
  const map = await res.text();
  const sites = map
    .split("<loc>")
    .map((site) => site.split("</loc>")[0]!.trim())
    .slice(1);
  return sites;
};

const splitText = async (text: string) => {
  const splitter = new MarkdownTextSplitter({
    chunkSize: 512,
    chunkOverlap: 40,
  });
  return await splitter.createDocuments([text]);
};

export const getPage = async (href: string) => {
  const url = new URL(href);
  const { html, title, description } = await getPageWithPuppeteer(url);
  const markdown = htmlToMD(html, url);
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

const test = async () => {
  const pages = [
    "https://asius.ai",
    "https://wolfagency.ee/",
    "https://astro.build",
    "https://ion.sst.dev/docs/component/aws/astro/",
    "https://framer.com/",
    "https://www.err.ee/",
  ];
  const path = "out";
  fs.mkdirSync(path, { recursive: true });

  for (const page of pages) {
    const res = await getPage(page);
    const name = page.split("/")[2];
    fs.writeFileSync(`${path}/${name}.md`, res.markdown);
    fs.writeFileSync(`${path}/${name}-split.md`, res.texts.join("\n\n-----SPLIT-----\n\n"));
    console.log(`${name} done`);
  }
  browser?.close();
};

test();
