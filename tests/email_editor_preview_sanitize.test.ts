import { mount } from "@vue/test-utils";
import type { Document } from "../src/core/types";
import EmailEditor from "../src/vue/EmailEditor.vue";

describe("EmailEditor - final preview sanitize", () => {
  it("sanitizes srcdoc content for html blocks", async () => {
    const document: Document = {
      id: "doc-preview",
      layout: { previewMode: "desktop", previewWidthPx: 640 },
      blocks: [
        {
          id: "html-1",
          type: "html",
          content:
            "<style>.preview-safe { color: red; }</style><div class=\"preview-safe\" style=\"color:red\" onclick=\"alert(1)\">ok</div><script>alert(1)</script><img src=\"x\" onerror=\"alert(2)\" /><a href=\"javascript:alert(3)\">bad</a>"
        }
      ]
    };

    const wrapper = mount(EmailEditor, {
      propsData: { document }
    });

    const previewButton = wrapper.findAll(".ee-action-button").at(0);
    expect(previewButton.exists()).toBe(true);
    await previewButton.trigger("click");
    await wrapper.vm.$nextTick();

    const iframe = wrapper.find("iframe.ee-preview-frame");
    expect(iframe.exists()).toBe(true);
    expect(iframe.attributes("sandbox")).toBe("");

    const srcdoc = iframe.attributes("srcdoc") ?? "";
    expect(srcdoc).not.toMatch(/<script/i);
    expect(srcdoc).not.toMatch(/\sonclick=/i);
    expect(srcdoc).not.toMatch(/\sonerror=/i);
    expect(srcdoc).not.toMatch(/javascript:/i);
    expect(srcdoc).toContain(">bad</a>");
    expect(srcdoc).toContain("<style>.preview-safe { color: red; }</style>");
    expect(srcdoc).toContain("class=\"preview-safe\"");

    wrapper.destroy();
  });
});
