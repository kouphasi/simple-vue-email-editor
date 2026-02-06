import { mount } from "@vue/test-utils";
import type { CustomBlockDefinition, CustomBlockInstance } from "../src/core/types";
import { registerCustomBlock } from "../src/core/custom_block_registry";
import CanvasCustomBlock from "../src/vue/canvas/CanvasCustomBlock.vue";

const createDefinition = (id: string): CustomBlockDefinition => ({
  id,
  displayName: "Unsafe Preview",
  settingsSchema: { fields: [] },
  defaultConfig: {},
  validate: () => ({ ok: true, missingFields: [] }),
  renderHtml: () =>
    "<style>.safe { color: red; }</style><div class=\"safe\" style=\"color:red\" onclick=\"alert(1)\"><script>alert(1)</script><a href=\"javascript:alert(1)\">bad</a><img src=\"x\" onerror=\"alert(2)\" /></div>"
});

describe("CanvasCustomBlock - sanitize html preview", () => {
  it("removes scripts, javascript urls and inline event handlers", () => {
    const definitionId = `unsafe-custom-${Date.now()}-${Math.random().toString(16).slice(2)}`;
    registerCustomBlock(createDefinition(definitionId));

    const block: CustomBlockInstance = {
      id: "custom-1",
      type: "custom",
      definitionId,
      config: {},
      state: "ready",
      readOnly: false
    };

    const wrapper = mount(CanvasCustomBlock, {
      propsData: { block }
    });

    const preview = wrapper.find(".ee-custom-preview").element as HTMLElement;
    expect(preview.innerHTML).not.toMatch(/<script/i);
    expect(preview.innerHTML).not.toMatch(/\sonclick=/i);
    expect(preview.innerHTML).not.toMatch(/\sonerror=/i);
    expect(preview.innerHTML).not.toMatch(/javascript:/i);
    expect(preview.innerHTML).toContain(">bad</a>");
    expect(preview.innerHTML).toContain("<style>.safe { color: red; }</style>");
    expect(preview.innerHTML).toContain("class=\"safe\"");
    expect(preview.innerHTML).toMatch(/\sstyle=/i);

    wrapper.destroy();
  });
});
