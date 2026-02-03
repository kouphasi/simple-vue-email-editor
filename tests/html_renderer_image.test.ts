import type { ImageBlock } from "../src/core/types";
import { renderBlockHtml } from "../src/rendering/html_renderer";

describe("html renderer image styles", () => {
  it("separates style declarations when only width is set", () => {
    const block: ImageBlock = {
      id: "image-style-width",
      type: "image",
      url: "https://example.com/image.png",
      status: "ready",
      display: {
        widthPx: 120,
        align: "center"
      }
    };

    const html = renderBlockHtml(block);
    expect(html).toContain("display:block;border:0;width:120px");
    expect(html).not.toContain("blockborder");
  });

  it("separates style declarations when only height is set", () => {
    const block: ImageBlock = {
      id: "image-style-height",
      type: "image",
      url: "https://example.com/image.png",
      status: "ready",
      display: {
        heightPx: 80,
        align: "center"
      }
    };

    const html = renderBlockHtml(block);
    expect(html).toContain("display:block;border:0;height:80px");
    expect(html).not.toContain("blockborder");
  });
});
