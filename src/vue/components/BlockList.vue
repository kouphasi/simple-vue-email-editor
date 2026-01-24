<template>
  <div class="ee-blocks" :style="{ width: `${widthPx}px` }">
    <div
      v-for="block in document.blocks"
      :key="block.id"
      class="ee-block-item"
      :class="{
        'is-dragging': draggingId === block.id,
        'is-drag-over': dragOverId === block.id
      }"
      draggable="true"
      @dragstart="handleDragStart(block.id, $event)"
      @dragover.prevent="handleDragOver(block.id)"
      @dragleave="handleDragLeave(block.id)"
      @drop.prevent="handleDrop(block.id)"
      @dragend="handleDragEnd"
    >
      <TextBlock v-if="block.type === 'text'" :block="block" @update="emitUpdate" />
      <ButtonBlock v-else-if="block.type === 'button'" :block="block" @update="emitUpdate" />
      <ImageBlock
        v-else-if="block.type === 'image'"
        :block="block"
        :on-image-upload="onImageUpload"
        @update="emitUpdate"
      />
      <div v-else class="ee-unknown">Unsupported block</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import type { Block, Document } from "../../core/types";
import type { ImageUploadHandler } from "../../core/editor_api";
import TextBlock from "../blocks/TextBlock.vue";
import ButtonBlock from "../blocks/ButtonBlock.vue";
import ImageBlock from "../blocks/ImageBlock.vue";

const props = defineProps<{
  document: Document;
  widthPx: number;
  onImageUpload?: ImageUploadHandler;
}>();

const emit = defineEmits<{
  (event: "update-block", block: Block): void;
  (event: "reorder", fromIndex: number, toIndex: number): void;
}>();

const draggingId = ref<string | null>(null);
const dragOverId = ref<string | null>(null);

const emitUpdate = (block: Block): void => {
  emit("update-block", block);
};

const handleDragStart = (id: string, event: DragEvent): void => {
  draggingId.value = id;
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", id);
  }
};

const handleDragOver = (id: string): void => {
  if (!draggingId.value) {
    return;
  }

  dragOverId.value = id;
};

const handleDragLeave = (id: string): void => {
  if (dragOverId.value === id) {
    dragOverId.value = null;
  }
};

const handleDrop = (id: string): void => {
  if (!draggingId.value) {
    return;
  }

  const fromIndex = props.document.blocks.findIndex((block) => block.id === draggingId.value);
  const toIndex = props.document.blocks.findIndex((block) => block.id === id);

  draggingId.value = null;
  dragOverId.value = null;

  if (fromIndex >= 0 && toIndex >= 0 && fromIndex !== toIndex) {
    emit("reorder", fromIndex, toIndex);
  }
};

const handleDragEnd = (): void => {
  draggingId.value = null;
  dragOverId.value = null;
};
</script>

<style scoped>
.ee-blocks {
  display: flex;
  flex-direction: column;
  gap: 12px;
  background: var(--ee-surface);
  border: 1px solid var(--ee-border);
  border-radius: var(--ee-radius);
  padding: 16px;
  box-shadow: var(--ee-shadow);
  max-width: 100%;
  margin: 0 auto;
}

.ee-block-item {
  border: 1px solid var(--ee-border);
  border-radius: 10px;
  padding: 12px;
  background: #fff;
}

.ee-block-item.is-dragging {
  opacity: 0.6;
}

.ee-block-item.is-drag-over {
  border-color: var(--ee-primary);
  box-shadow: 0 0 0 2px rgba(43, 108, 176, 0.15);
}

.ee-unknown {
  color: var(--ee-muted);
  font-size: 14px;
}
</style>
