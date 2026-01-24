<template>
  <div class="ee-block ee-block-button">
    <div class="ee-button-fields">
      <input
        type="text"
        :value="block.label"
        placeholder="Button label"
        @input="update({ label: ($event.target as HTMLInputElement).value })"
      />
      <input
        type="url"
        :value="block.url"
        placeholder="https://example.com"
        @input="update({ url: ($event.target as HTMLInputElement).value })"
      />
      <select
        :value="block.shape"
        @change="update({ shape: ($event.target as HTMLSelectElement).value as ButtonBlock['shape'] })"
      >
        <option value="square">square</option>
        <option value="rounded">rounded</option>
        <option value="pill">pill</option>
      </select>
      <input
        type="color"
        :value="block.textColor"
        @change="update({ textColor: ($event.target as HTMLInputElement).value })"
      />
      <input
        type="color"
        :value="block.backgroundColor"
        @change="update({ backgroundColor: ($event.target as HTMLInputElement).value })"
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
