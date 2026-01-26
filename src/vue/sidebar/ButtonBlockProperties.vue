<template>
  <div class="ee-properties-panel">
    <div class="ee-panel-section">
      <h3>Button Properties</h3>
      
      <div class="ee-control-group">
        <label>Label</label>
        <input
          type="text"
          :value="block.label"
          @input="updateLabel"
          placeholder="Button Label"
        />
      </div>

      <div class="ee-control-group">
        <label>URL</label>
        <input
          type="url"
          :value="block.url"
          @input="updateUrl"
          placeholder="https://example.com"
        />
      </div>

      <div class="ee-control-group">
        <label>Shape</label>
        <div class="ee-shape-options">
          <button
            v-for="shape in shapes"
            :key="shape"
            type="button"
            :class="{ active: block.shape === shape }"
            @click="updateShape(shape)"
          >
            {{ shape }}
          </button>
        </div>
      </div>

      <div class="ee-control-group">
        <label>Text Color</label>
        <div class="ee-color-input-wrapper">
          <input
            type="color"
            :value="block.textColor"
            @input="updateTextColor"
          />
          <span>{{ block.textColor }}</span>
        </div>
      </div>

      <div class="ee-control-group">
        <label>Background Color</label>
        <div class="ee-color-input-wrapper">
          <input
            type="color"
            :value="block.backgroundColor"
            @input="updateBackgroundColor"
          />
          <span>{{ block.backgroundColor }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ButtonBlock, ButtonShape } from "../../core/types";

const props = defineProps<{
  block: ButtonBlock;
}>();

const emit = defineEmits<{
  (event: "update", block: ButtonBlock): void;
}>();

const shapes: ButtonShape[] = ["square", "rounded", "pill"];

const updateLabel = (event: Event) => {
  const input = event.target as HTMLInputElement;
  emit("update", { ...props.block, label: input.value });
};

const updateUrl = (event: Event) => {
  const input = event.target as HTMLInputElement;
  emit("update", { ...props.block, url: input.value });
};

const updateShape = (shape: ButtonShape) => {
  emit("update", { ...props.block, shape });
};

const updateTextColor = (event: Event) => {
  const input = event.target as HTMLInputElement;
  emit("update", { ...props.block, textColor: input.value });
};

const updateBackgroundColor = (event: Event) => {
  const input = event.target as HTMLInputElement;
  emit("update", { ...props.block, backgroundColor: input.value });
};
</script>

<style scoped>
.ee-properties-panel {
  padding: 16px;
}

.ee-panel-section h3 {
  font-size: 14px;
  font-weight: 600;
  margin: 0 0 12px 0;
  color: #374151;
}

.ee-control-group {
  margin-bottom: 16px;
}

.ee-control-group label {
  display: block;
  font-size: 12px;
  color: #6b7280;
  margin-bottom: 4px;
}

.ee-control-group input[type="text"],
.ee-control-group input[type="url"] {
  width: 100%;
  padding: 8px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  box-sizing: border-box;
}

.ee-shape-options {
  display: flex;
  gap: 8px;
}

.ee-shape-options button {
  flex: 1;
  padding: 6px;
  border: 1px solid #d1d5db;
  background: #fff;
  border-radius: 6px;
  font-size: 12px;
  cursor: pointer;
  color: #374151;
  text-transform: capitalize;
}

.ee-shape-options button.active {
  background: #eff6ff;
  border-color: #3b82f6;
  color: #1d4ed8;
  font-weight: 500;
}

.ee-color-input-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
  border: 1px solid #d1d5db;
  padding: 4px 8px;
  border-radius: 6px;
  background: #fff;
}

.ee-color-input-wrapper input[type="color"] {
  border: none;
  width: 24px;
  height: 24px;
  padding: 0;
  background: none;
  cursor: pointer;
}

.ee-color-input-wrapper span {
  font-size: 13px;
  color: #4b5563;
  font-family: monospace;
}
</style>
