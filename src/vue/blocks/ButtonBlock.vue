<template>
  <div class="ee-block ee-block-button">
    <div class="ee-button-fields">
      <input
        type="text"
        :value="block.label"
        placeholder="Button label"
        @input="handleLabelInput"
      />
      <input
        type="url"
        :value="block.url"
        placeholder="https://example.com"
        @input="handleUrlInput"
      />
      <select
        :value="block.shape"
        @change="handleShapeChange"
      >
        <option value="square">square</option>
        <option value="rounded">rounded</option>
        <option value="pill">pill</option>
      </select>
      <input
        type="color"
        :value="block.textColor"
        @change="handleTextColorChange"
      />
      <input
        type="color"
        :value="block.backgroundColor"
        @change="handleBackgroundColorChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ButtonBlock } from "../../core/types";

const props = defineProps<{
  block: ButtonBlock;
}>();

const emit = defineEmits<{
  (event: "update", block: ButtonBlock): void;
}>();

const update = (next: Partial<ButtonBlock>): void => {
  emit("update", {
    ...props.block,
    ...next
  });
};

const handleLabelInput = (event: Event): void => {
  const input = event.target as HTMLInputElement;
  update({ label: input.value });
};

const handleUrlInput = (event: Event): void => {
  const input = event.target as HTMLInputElement;
  update({ url: input.value });
};

const handleShapeChange = (event: Event): void => {
  const input = event.target as HTMLSelectElement;
  update({ shape: input.value as ButtonBlock["shape"] });
};

const handleTextColorChange = (event: Event): void => {
  const input = event.target as HTMLInputElement;
  update({ textColor: input.value });
};

const handleBackgroundColorChange = (event: Event): void => {
  const input = event.target as HTMLInputElement;
  update({ backgroundColor: input.value });
};
</script>

<style scoped>
.ee-button-fields {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 8px;
  align-items: center;
}

.ee-button-fields input,
.ee-button-fields select {
  padding: 6px 8px;
  border: 1px solid var(--ee-border);
  border-radius: 6px;
}
</style>
