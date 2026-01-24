<template>
  <div class="ee-block ee-block-image">
    <div class="ee-image-fields">
      <input
        type="url"
        :value="block.url"
        placeholder="https://example.com/image.png"
        @input="update({ url: ($event.target as HTMLInputElement).value })"
      />
      <span class="ee-image-status">{{ block.status }}</span>
      <select
        :value="block.display.align ?? 'center'"
        @change="updateDisplay({ align: ($event.target as HTMLSelectElement).value as ImageBlock['display']['align'] })"
      >
        <option value="left">left</option>
        <option value="center">center</option>
        <option value="right">right</option>
      </select>
      <input
        type="number"
        min="0"
        :value="block.display.widthPx ?? ''"
        placeholder="Width"
        @input="updateDisplay({ widthPx: parseNumber(($event.target as HTMLInputElement).value) })"
      />
      <input
        type="number"
        min="0"
        :value="block.display.heightPx ?? ''"
        placeholder="Height"
        @input="updateDisplay({ heightPx: parseNumber(($event.target as HTMLInputElement).value) })"
      />
      <input type="file" accept="image/*" @change="handleFileChange" />
    </div>
    <img v-if="block.url" class="ee-image-preview" :src="block.url" alt="Image preview" />
  </div>
</template>

<script setup lang="ts">
import type { ImageBlock } from "../../core/types";
import type { ImageUploadHandler } from "../../core/editor_api";

const props = defineProps<{
  block: ImageBlock;
  onImageUpload?: ImageUploadHandler;
}>();

const emit = defineEmits<{
  (event: "update", block: ImageBlock): void;
}>();

const update = (next: Partial<ImageBlock>): void => {
  emit("update", {
    ...props.block,
    ...next
  });
};

const updateDisplay = (display: Partial<ImageBlock["display"]>): void => {
  emit("update", {
    ...props.block,
    display: {
      ...props.block.display,
      ...display
    }
  });
};

const parseNumber = (value: string): number | undefined => {
  if (!value) {
    return undefined;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
};

const handleFileChange = async (event: Event): Promise<void> => {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  if (!file) {
    return;
  }

  if (!props.onImageUpload) {
    update({ status: "error" });
    return;
  }

  update({ status: "uploading" });

  try {
    const url = await props.onImageUpload(file);
    update({
      url,
      status: "ready"
    });
  } catch {
    update({ status: "error" });
  }
};
</script>

<style scoped>
.ee-image-fields {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 8px;
  align-items: center;
}

.ee-image-fields input,
.ee-image-fields select {
  padding: 6px 8px;
  border: 1px solid var(--ee-border);
  border-radius: 6px;
}

.ee-image-status {
  font-size: 12px;
  color: var(--ee-muted);
}

.ee-image-preview {
  width: 100%;
  max-width: 100%;
  margin-top: 8px;
  border-radius: 8px;
  border: 1px solid var(--ee-border);
}
</style>
