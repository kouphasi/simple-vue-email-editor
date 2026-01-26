<template>
  <div class="ee-properties-panel">
    <div class="ee-panel-section">
      <h3>Layout</h3>
      <div class="ee-control-group">
        <label>Preview Mode</label>
        <div class="ee-toggle-group">
          <button
            type="button"
            :class="{ active: layout.previewMode === 'mobile' }"
            @click="updateMode('mobile')"
          >
            Mobile
          </button>
          <button
            type="button"
            :class="{ active: layout.previewMode === 'desktop' }"
            @click="updateMode('desktop')"
          >
            Desktop
          </button>
        </div>
      </div>
      <div class="ee-control-group">
        <label>Width</label>
        <div class="ee-value-display">{{ layout.previewWidthPx }}px</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { type LayoutSettings, type PreviewMode, PREVIEW_WIDTHS } from "../../core/types";

const props = defineProps<{
  layout: LayoutSettings;
}>();

const emit = defineEmits<{
  (event: "update", layout: LayoutSettings): void;
}>();

const updateMode = (mode: PreviewMode) => {
  emit("update", {
    previewMode: mode,
    previewWidthPx: PREVIEW_WIDTHS[mode]
  });
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

.ee-toggle-group {
  display: flex;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  overflow: hidden;
}

.ee-toggle-group button {
  flex: 1;
  border: none;
  background: #fff;
  padding: 6px 12px;
  font-size: 13px;
  cursor: pointer;
  color: #6b7280;
}

.ee-toggle-group button.active {
  background: #f3f4f6;
  color: #111827;
  font-weight: 500;
}

.ee-toggle-group button:first-child {
  border-right: 1px solid #e5e7eb;
}

.ee-value-display {
  font-size: 14px;
  color: #111827;
  padding: 6px 0;
}
</style>
