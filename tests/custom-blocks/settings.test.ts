import { getQueriesForElement } from "@testing-library/dom";
import { mount } from "@vue/test-utils";
import type { CustomBlockDefinition, Document } from "../../src/core/types";
import { registerCustomBlock } from "../../src/core/custom_block_registry";
import { createCustomBlockInstance } from "../../src/services/document_service";
import { serializeDocument } from "../../src/services/json_export";
import CustomBlock from "../../src/vue/blocks/CustomBlock.vue";
import CustomBlockProperties from "../../src/vue/sidebar/CustomBlockProperties.vue";

const createDefinition = (id: string): CustomBlockDefinition => ({
  id,
  displayName: "Hero",
  category: "Marketing",
  settingsSchema: {
    fields: [
      { key: "headline", label: "Headline", type: "string", required: true, default: "Hello" }
    ]
  },
  defaultConfig: { headline: "Hello" },
  validate: () => ({ ok: true, missingFields: [] }),
  renderHtml: (config) => `<div class=\"hero\">${config.headline}</div>`
});

describe("Custom block settings", () => {
  it("updates the preview when a setting changes", async () => {
    const definition = createDefinition(`hero-${Date.now()}-settings`);
    registerCustomBlock(definition);

    const block = createCustomBlockInstance(definition.id);

    const wrapper = mount({
      components: { CustomBlockProperties, CustomBlock },
      data() {
        return { block };
      },
      methods: {
        handleUpdate(next: typeof block) {
          this.block = next;
        }
      },
      template: `
        <div>
          <CustomBlockProperties :block="block" @update="handleUpdate" />
          <CustomBlock :block="block" />
        </div>
      `
    });

    await wrapper.vm.$nextTick();

    const { getByLabelText } = getQueriesForElement(wrapper.element as HTMLElement);
    const input = getByLabelText("Headline") as HTMLInputElement;
    input.value = "Updated headline";
    input.dispatchEvent(new Event("input"));

    await wrapper.vm.$nextTick();
    expect(wrapper.html()).toContain("Updated headline");

    wrapper.destroy();
  });

  it("persists edited custom block settings after save and reopen", async () => {
    const definition = createDefinition(`hero-${Date.now()}-persist`);
    registerCustomBlock(definition);

    const block = createCustomBlockInstance(definition.id);

    const wrapper = mount({
      components: { CustomBlockProperties },
      data() {
        return { block };
      },
      methods: {
        handleUpdate(next: typeof block) {
          this.block = next;
        }
      },
      template: `<CustomBlockProperties :block="block" @update="handleUpdate" />`
    });

    await wrapper.vm.$nextTick();

    const { getByLabelText } = getQueriesForElement(wrapper.element as HTMLElement);
    const input = getByLabelText("Headline") as HTMLInputElement;
    input.value = "Persisted headline";
    input.dispatchEvent(new Event("input"));

    await wrapper.vm.$nextTick();

    const updatedBlock = (wrapper.vm as { block: typeof block }).block;
    const document: Document = {
      id: "doc-2",
      layout: { previewMode: "desktop", previewWidthPx: 640 },
      blocks: [updatedBlock]
    };

    const json = serializeDocument(document);
    const parsed = JSON.parse(json) as Document;
    const parsedBlock = parsed.blocks[0] as typeof updatedBlock;
    expect(parsedBlock.config).toMatchObject({ headline: "Persisted headline" });

    wrapper.destroy();
  });
});
