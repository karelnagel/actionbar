import { MarkdownTextSplitter } from "langchain/text_splitter";
import fs from "fs";
import { htmlToMD } from "./html-to-md";
import { browser, getPageWithPuppeteer } from "./get-html";

export type Page = {
  url: string;
  title: string;
  description: string;
  texts: string[];
  markdown: string;
  status: number;
};

const splitText = async (text: string) => {
  const splitter = new MarkdownTextSplitter({
    chunkSize: 512,
    chunkOverlap: 40,
  });
  return await splitter.createDocuments([text]);
};

export const getPage = async (href: string): Promise<Page> => {
  const url = new URL(href);
  const { html, ...props } = await getPageWithPuppeteer(url);
  const markdown = htmlToMD(html, url);
  const output = await splitText(markdown);
  return {
    ...props,
    markdown,
    url: href,
    texts: output.map((doc) => doc.pageContent),
  };
};

export const test = async () => {
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

// test();
