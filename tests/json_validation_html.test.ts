import type { Document } from "../src/core/types";
import { parseDocument } from "../src/services/json_import";
import { validateDocument } from "../src/services/json_validation";

describe("json validation - html block", () => {
  const documentWithHtmlBlock: Document = {
    id: "doc-html-1",
    layout: {
      previewMode: "desktop",
      previewWidthPx: 640
    },
    blocks: [
      {
        id: "html-1",
        type: "html",
        content: "<div><strong>Hello</strong></div>"
      }
    ]
  };

  it("accepts html blocks in validateDocument", () => {
    const result = validateDocument(documentWithHtmlBlock);
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it("parses persisted documents containing html blocks", () => {
    const json = JSON.stringify(documentWithHtmlBlock);
    const parsed = parseDocument(json);
    expect(parsed.blocks[0]?.type).toBe("html");
  });
});

