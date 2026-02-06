export type HtmlSanitizerOptions = {
  stripStyleAttributes?: boolean;
};

const BLOCKED_TAGS = [
  "script",
  "iframe",
  "object",
  "embed",
  "link",
  "meta",
  "base",
  "form"
].join(",");

const URL_ATTRS = new Set(["href", "src", "xlink:href", "formaction"]);
const JAVASCRIPT_URL_RE = /^\s*javascript:/i;

export const sanitizePreviewHtml = (
  html: string,
  options: HtmlSanitizerOptions = {}
): string => {
  const stripStyleAttributes = options.stripStyleAttributes ?? true;

  if (typeof DOMParser === "undefined" || typeof NodeFilter === "undefined") {
    return html;
  }

  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");

  doc.querySelectorAll(BLOCKED_TAGS).forEach((el) => el.remove());

  const walker = doc.createTreeWalker(doc.documentElement, NodeFilter.SHOW_ELEMENT);
  let currentNode = walker.currentNode as Element | null;

  while (currentNode) {
    for (const attr of Array.from(currentNode.attributes)) {
      const name = attr.name.toLowerCase();
      const value = attr.value;

      if (name.startsWith("on")) {
        currentNode.removeAttribute(attr.name);
        continue;
      }

      if (stripStyleAttributes && name === "style") {
        currentNode.removeAttribute(attr.name);
        continue;
      }

      if (URL_ATTRS.has(name) && JAVASCRIPT_URL_RE.test(value)) {
        currentNode.removeAttribute(attr.name);
      }
    }

    currentNode = walker.nextNode() as Element | null;
  }

  const headStyles = Array.from(doc.head.querySelectorAll("style"))
    .map((style) => style.outerHTML)
    .join("");

  return `${headStyles}${doc.body.innerHTML}`;
};
