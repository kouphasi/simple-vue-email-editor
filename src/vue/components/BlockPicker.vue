<template>
  <div class="ee-block-picker">
    <button
      type="button"
      class="ee-pill"
      @click="addText"
    >
      Add Text
    </button>
    <button
      type="button"
      class="ee-pill"
      @click="addButton"
    >
      Add Button
    </button>
    <button
      type="button"
      class="ee-pill"
      @click="addImage"
    >
      Add Image
    </button>
    <button
      type="button"
      class="ee-pill"
      @click="addHtml"
    >
      Add HTML
    </button>

    <div v-if="customBlockGroups.length" class="ee-custom-blocks">
      <div
        v-for="group in customBlockGroups"
        :key="group.category"
        class="ee-custom-block-group"
      >
        <div class="ee-custom-block-title">{{ group.category }}</div>
        <div class="ee-custom-block-actions">
          <button
            v-for="definition in group.blocks"
            :key="definition.id"
            type="button"
            class="ee-pill ee-pill--custom"
            @click="addCustomBlock(definition)"
          >
            Add {{ definition.displayName }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import type {
  Block,
  ButtonBlock,
  CustomBlockDefinition,
  HtmlBlock,
  ImageBlock,
  TextBlock
} from "../../core/types";
import { subscribeCustomBlockDefinitions } from "../../core/custom_block_registry";
import { createCustomBlockInstance } from "../../services/document_service";

const emit = defineEmits<{
  (event: "add", block: Block): void;
}>();

const customBlocks = ref<CustomBlockDefinition[]>([]);
let unsubscribe: (() => void) | null = null;

const createId = (): string => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `block_${Date.now()}_${Math.random().toString(16).slice(2)}`;
};

const createTextBlock = (): TextBlock => ({
  id: createId(),
  type: "text",
  text: "New text",
  runs: []
});

const createButtonBlock = (): ButtonBlock => ({
  id: createId(),
  type: "button",
  label: "Button",
  url: "https://example.com",
  shape: "rounded",
  textColor: "#ffffff",
  backgroundColor: "#2b6cb0"
});

const createImageBlock = (): ImageBlock => ({
  id: createId(),
  type: "image",
  url: "",
  status: "pending",
  display: {
    align: "center"
  }
});

const createHtmlBlock = (): HtmlBlock => ({
  id: createId(),
  type: "html",
  content: ""
});

const addText = (): void => {
  emit("add", createTextBlock());
};

const addButton = (): void => {
  emit("add", createButtonBlock());
};

const addImage = (): void => {
  emit("add", createImageBlock());
};

const addHtml = (): void => {
  emit("add", createHtmlBlock());
};

const addCustomBlock = (definition: CustomBlockDefinition): void => {
  emit("add", createCustomBlockInstance(definition.id));
};

const customBlockGroups = computed(() => {
  const grouped = new Map<string, CustomBlockDefinition[]>();
  for (const definition of customBlocks.value) {
    const category = definition.category?.trim() || "Uncategorized";
    const items = grouped.get(category);
    if (items) {
      items.push(definition);
    } else {
      grouped.set(category, [definition]);
    }
  }

  return [...grouped.entries()].map(([category, blocks]) => ({ category, blocks }));
});

onMounted(() => {
  unsubscribe = subscribeCustomBlockDefinitions((definitions) => {
    customBlocks.value = definitions;
  });
});

onBeforeUnmount(() => {
  if (unsubscribe) {
    unsubscribe();
  }
  unsubscribe = null;
});
</script>

<style scoped>
.ee-block-picker {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: flex-start;
}

.ee-pill {
  border: 1px solid var(--ee-control-border);
  background: var(--ee-control-bg);
  border-radius: 999px;
  padding: 7px 14px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.01em;
  color: var(--ee-text-color);
  box-shadow: 0 10px 20px rgba(28, 24, 18, 0.08);
  transition:
    transform 150ms ease,
    border-color 150ms ease,
    box-shadow 150ms ease,
    background 150ms ease;
}

.ee-pill:hover {
  border-color: var(--ee-primary);
  background: var(--ee-control-hover);
  transform: translateY(-1px);
  box-shadow: 0 14px 24px rgba(28, 24, 18, 0.12);
}

.ee-pill:focus-visible {
  outline: 2px solid var(--ee-ring);
  outline-offset: 2px;
}

.ee-pill--custom {
  border-style: dashed;
}

.ee-custom-blocks {
  flex-basis: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 8px;
}

.ee-custom-block-group {
  border: 1px dashed var(--ee-border);
  border-radius: 12px;
  padding: 10px;
  background: var(--ee-control-bg);
}

.ee-custom-block-title {
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--ee-muted);
  margin-bottom: 6px;
}

.ee-custom-block-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
</style>
