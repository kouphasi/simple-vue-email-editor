import { getQueriesForElement } from "@testing-library/dom";
import { shallowMount } from "@vue/test-utils";
import type { CustomBlockDefinition, Document } from "../../src/core/types";
import { registerCustomBlock } from "../../src/core/custom_block_registry";
import { serializeDocument } from "../../src/services/json_export";
import { createCustomBlockInstance } from "../../src/services/document_service";
import BlockPicker from "../../src/vue/components/BlockPicker.vue";

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
  renderHtml: () => "<div>Hero</div>"
});

describe("Custom block registration", () => {
  it("shows registered custom blocks in the picker with category", async () => {
    const definition = createDefinition(`hero-${Date.now()}`);
    registerCustomBlock(definition);

    const wrapper = shallowMount(BlockPicker);
    await wrapper.vm.$nextTick();

    const { getByText } = getQueriesForElement(wrapper.element as HTMLElement);
    expect(getByText("Marketing")).toBeTruthy();
    expect(getByText("Add Hero")).toBeTruthy();

    wrapper.destroy();
  });

  it("creates a custom block instance with default config when inserted", async () => {
    const definition = createDefinition(`hero-${Date.now()}-insert`);
    registerCustomBlock(definition);

    const wrapper = shallowMount(BlockPicker);
    await wrapper.vm.$nextTick();

    const { getByText } = getQueriesForElement(wrapper.element as HTMLElement);
    const button = getByText("Add Hero");
    button.dispatchEvent(new MouseEvent("click"));

    const emitted = wrapper.emitted("add");
    expect(emitted).toBeTruthy();
    const block = emitted?.[0]?.[0];
    expect(block).toMatchObject({
      type: "custom",
      definitionId: definition.id,
      config: { headline: "Hello" },
      state: "ready",
      readOnly: false
    });

    wrapper.destroy();
  });

  it("includes custom block identifier and config in document export", () => {
    const definition = createDefinition(`hero-${Date.now()}-export`);
    registerCustomBlock(definition);

    const block = createCustomBlockInstance(definition.id);
    const document: Document = {
      id: "doc-1",
      layout: { previewMode: "desktop", previewWidthPx: 640 },
      blocks: [block]
    };

    const json = serializeDocument(document);
    const parsed = JSON.parse(json) as Document;
    expect(parsed.blocks[0]).toMatchObject({
      type: "custom",
      definitionId: definition.id,
      config: { headline: "Hello" }
    });
  });
});
