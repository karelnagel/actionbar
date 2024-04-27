import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import * as cheerio from "cheerio";

export const getPagesFromSitemap = async (url: string): Promise<string[]> => {
  const res = await fetch(url);
  const map = await res.text();
  const sites = map
    .split("<loc>")
    .map((site) => site.split("</loc>")[0]!.trim())
    .slice(1);
  return sites;
};

export const getPage = async (url: string) => {
  const html = await fetch(url).then((res) => res.text());
  const $ = cheerio.load(html);
  $("script").remove();
  const title = $("title").text() || "";
  const description = $("meta[name=description]").attr("content") || "";
  const text = $("body").text();
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 175,
    chunkOverlap: 20,
  });
  const output = await splitter.createDocuments([text]);
  return {
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
