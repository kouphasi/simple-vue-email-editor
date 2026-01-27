import type { Document } from "../src/core/types";
import { parseDocument } from "../src/services/json_import";
import { validateDocument } from "../src/services/json_validation";

describe("json validation - align", () => {
  const layout = {
    previewMode: "desktop" as const,
    previewWidthPx: 640 as const
  };

  it("rejects invalid text alignment", () => {
    const document = {
      id: "doc-align-text-1",
      layout,
      blocks: [
        {
          id: "text-1",
          type: "text",
          text: "Hello",
          runs: [],
          align: 'center\" onmouseover=\"alert(1)'
        }
      ]
    } as unknown as Document;

    const result = validateDocument(document);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain("Invalid text alignment in block text-1");

    const json = JSON.stringify(document);
    expect(() => parseDocument(json)).toThrow(/Invalid text alignment/);
  });

  it("rejects invalid button alignment", () => {
    const document = {
      id: "doc-align-button-1",
      layout,
      blocks: [
        {
          id: "button-1",
          type: "button",
          label: "Click",
          url: "https://example.com",
          shape: "rounded",
          textColor: "#ffffff",
          backgroundColor: "#000000",
          align: "justify"
        }
      ]
    } as unknown as Document;

    const result = validateDocument(document);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain("Invalid button alignment in block button-1");
  });

  it("rejects invalid image alignment", () => {
    const document = {
      id: "doc-align-image-1",
      layout,
      blocks: [
        {
          id: "image-1",
          type: "image",
          url: "https://example.com/image.png",
          status: "ready",
          display: {
            align: "top"
          }
        }
      ]
    } as unknown as Document;

    const result = validateDocument(document);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain("Invalid image alignment in block image-1");
  });
});
