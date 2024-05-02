import { RecursiveCharacterTextSplitter, MarkdownTextSplitter } from "langchain/text_splitter";
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

const fixUrl = (url: string, pageUrl: URL) => {
  url = url.replaceAll(" ", "%20");
  if (url.startsWith("/")) return pageUrl.origin + url;
  return url;
};
const htmlToMd = (html: string, url: URL) => {
  const converter = new TurndownService({
    headingStyle: "atx",
    fence: "```",
    linkStyle: "inlined",
    codeBlockStyle: "fenced",
  });
  converter.addRule("a", {
    filter: ["a"],
    replacement: (content, node) => {
      const href = fixUrl((node as unknown as { href: string }).href, url);
      if (!href) return content;
      content = content
        .split("\n")
        .filter((x) => x.trim())
        .join("\n\n");
      // One-line children that aren't headings or images
      if (!content.includes("\n") && !content.startsWith("#") && !content.startsWith("!"))
        return `[${content}](${href})`;
      return `\n\n${content}\n[LINK](${href})\n\n`;
    },
  });
  converter.addRule("video", {
    filter: ["video", "audio", "img"],
    replacement: (content, node) => {
      const src = (node as unknown as { src: string }).src;
      if (!src) return content;
      return `![${content}](${fixUrl(src, url)})`;
    },
  });
  converter.addRule("footerheader", {
    filter: ["footer", "header", "nav", "aside", "section", "article", "main"],
    replacement: (content, node) => {
      const tag = (node as unknown as { tagName: string }).tagName.toLowerCase();
      content = content
        .split("\n")
        .filter((x) => x.trim())
        .join("\n\n");
      return `\n\n<${tag}>\n\n${content}\n\n</${tag}>\n\n`;
    },
  });
  converter.addRule("hide", {
    filter: ["script", "style", "link", "meta", "iframe", "noscript"],
    replacement: () => "",
  });
  return converter.turndown(html);
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
  const res = await fetch(url);
  const text = await res.text();
  const $ = cheerio.load(text);
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
const pages = [
  "https://asius.ai",
  "https://wolfagency.ee/",
  "https://astro.build",
  "https://ion.sst.dev/docs/component/aws/astro/",
  "https://framer.com/",
  "https://www.err.ee/",
];
for (const page of pages) {
  getPage(page).then((x) => {
    fs.writeFileSync(`${path}/${page.split("/")[2]}.md`, x.markdown);
    fs.writeFileSync(
      `${path}/${page.split("/")[2]}-split.md`,
      x.texts.join("\n\n-----SPLIT-----\n\n"),
    );
  });
}
