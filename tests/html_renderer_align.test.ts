import type { ButtonBlock, TextBlock } from "../src/core/types";
import { renderBlockHtml } from "../src/rendering/html_renderer";

describe("html renderer alignment", () => {
  it("renders text block alignment", () => {
    const block: TextBlock = {
      id: "text-align-1",
      type: "text",
      text: "Hello",
      runs: [],
      align: "center"
    };

    const html = renderBlockHtml(block);
    expect(html).toContain("text-align:center");
  });

  it("renders button block alignment", () => {
    const block: ButtonBlock = {
      id: "button-align-1",
      type: "button",
      label: "Click",
      url: "https://example.com",
      shape: "rounded",
      textColor: "#ffffff",
      backgroundColor: "#000000",
      align: "right"
    };

    const html = renderBlockHtml(block);
    expect(html).toContain("text-align:right");
  });

  it("sanitizes unexpected alignment values", () => {
    const block: TextBlock = {
      id: "text-align-unsafe-1",
      type: "text",
      text: "Hello",
      runs: [],
      align: 'center";color:red' as unknown as TextBlock["align"]
    };

    const html = renderBlockHtml(block);
    expect(html).toContain("text-align:left");
    expect(html).not.toContain('color:red');
  });
});
