import TurndownService from "turndown";

const fixUrl = (url: string, pageUrl: URL) => {
  url = url.replaceAll(" ", "%20");
  if (url.startsWith("/")) return pageUrl.origin + url;
  if (url.startsWith("#")) return pageUrl.toString() + url;
  return url;
};

export const htmlToMD = (html: string, url: URL) => {
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
    replacement: (content, node: any) => {
      const src = node.src;
      const alt = node.alt;
      if (!src) return content;
      return `![${content || alt || ""}](${fixUrl(src, url)})`;
    },
  });
  converter.addRule("footerheader", {
    filter: ["footer", "header", "nav", "aside", "section", "article", "main"],
    replacement: (content, node: any) => {
      const tag = node.tagName.toLowerCase();
      const id = node.id;
      content = content
        .split("\n")
        .filter((x) => x.trim())
        .join("\n\n");
      return `\n\n<${tag} ${id ? `id="${id}"` : ""}>\n\n${content}\n\n</${tag}>\n\n`;
    },
  });
  converter.addRule("hide", {
    filter: ["script", "style", "link", "meta", "iframe", "noscript"],
    replacement: () => "",
  });
  converter.addRule("headings", {
    filter: ["h1", "h2", "h3", "h4", "h5", "h6"],
    replacement: (content, node: any) => {
      const heading = node.tagName.toLowerCase();
      const id = node.id;
      if (id) return `\n<${heading} id="${id}">${content}</${heading}>\n`;
      return `${"#".repeat(Number(heading.slice(1)))} ${content}`;
    },
  });
  return converter.turndown(html);
};
