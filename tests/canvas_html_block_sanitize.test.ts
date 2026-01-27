import { mount } from "@vue/test-utils";
import type { HtmlBlock } from "../src/core/types";
import CanvasHtmlBlock from "../src/vue/canvas/CanvasHtmlBlock.vue";

const createBlock = (content: string): HtmlBlock => ({
  id: "html-1",
  type: "html",
  content
});

describe("CanvasHtmlBlock - sanitize html preview", () => {
  it("removes script tags and inline event handlers", () => {
    const block = createBlock(
      "<div>Hello</div><script>alert(1)</script><img src=\"x\" onerror=\"alert(2)\" />"
    );

    const wrapper = mount(CanvasHtmlBlock, {
      propsData: { block }
    });

    const preview = wrapper.find(".ee-html-preview").element as HTMLElement;
    expect(preview.innerHTML).not.toMatch(/<script/i);
    expect(preview.innerHTML).not.toMatch(/\sonerror=/i);

    wrapper.destroy();
  });

  it("removes javascript: urls from href and src", () => {
    const block = createBlock(
      "<a href=\"javascript:alert(1)\">bad</a><img src=\"javascript:alert(2)\" />"
    );

    const wrapper = mount(CanvasHtmlBlock, {
      propsData: { block }
    });

    const preview = wrapper.find(".ee-html-preview").element as HTMLElement;
    expect(preview.innerHTML).not.toMatch(/javascript:/i);
    expect(preview.innerHTML).toContain(">bad</a>");

    wrapper.destroy();
  });

  it("removes blocked tags such as iframe", () => {
    const block = createBlock(
      "<div>safe</div><iframe src=\"https://example.com\"></iframe>"
    );

    const wrapper = mount(CanvasHtmlBlock, {
      propsData: { block }
    });

    const preview = wrapper.find(".ee-html-preview").element as HTMLElement;
    expect(preview.innerHTML).toContain("<div>safe</div>");
    expect(preview.innerHTML).not.toMatch(/<iframe/i);

    wrapper.destroy();
  });

  it("removes inline style attributes", () => {
    const block = createBlock(
      "<p style=\"color:red;background:url(javascript:alert(1))\">styled</p>"
    );

    const wrapper = mount(CanvasHtmlBlock, {
      propsData: { block }
    });

    const preview = wrapper.find(".ee-html-preview").element as HTMLElement;
    expect(preview.innerHTML).toContain("<p>styled</p>");
    expect(preview.innerHTML).not.toMatch(/\sstyle=/i);

    wrapper.destroy();
  });
});
