<template>
  <div class="ee-properties-panel">
    <div class="ee-panel-section">
      <h3>Image Properties</h3>

      <div class="ee-control-group">
        <label>Image Source</label>
        <div class="ee-image-source">
          <input
            type="file"
            accept="image/*"
            @change="handleFileChange"
            v-if="onImageUpload"
            class="ee-file-input"
          />
          <input
            type="url"
            :value="block.url"
            @input="updateUrl"
            placeholder="Image URL"
            class="ee-url-input"
          />
        </div>
        <div v-if="block.status === 'uploading'" class="ee-status">
          Uploading...
        </div>
        <div v-if="block.status === 'error'" class="ee-status error">
          Error loading image
        </div>
      </div>

      <div class="ee-control-group">
        <label>Dimensions</label>
        <div class="ee-dimensions-row">
          <div class="ee-dimension-input">
            <span class="ee-label-sm">W</span>
            <input
              type="number"
              :value="block.display.widthPx ?? ''"
              @input="updateWidth"
              placeholder="Auto"
            />
          </div>
          <div class="ee-dimension-input">
            <span class="ee-label-sm">H</span>
            <input
              type="number"
              :value="block.display.heightPx ?? ''"
              @input="updateHeight"
              placeholder="Auto"
            />
          </div>
        </div>
      </div>

      <div class="ee-control-group">
        <label>Alignment</label>
        <div class="ee-align-options">
          <button
            type="button"
            :class="{ active: (block.display.align || 'center') === 'left' }"
            @click="updateAlign('left')"
          >
            Left
          </button>
          <button
            type="button"
            :class="{ active: (block.display.align || 'center') === 'center' }"
            @click="updateAlign('center')"
          >
            Center
          </button>
          <button
            type="button"
            :class="{ active: (block.display.align || 'center') === 'right' }"
            @click="updateAlign('right')"
          >
            Right
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ImageBlock, ImageAlign } from "../../core/types";
import type { ImageUploadHandler } from "../../core/editor_api";

const props = defineProps<{
  block: ImageBlock;
  onImageUpload?: ImageUploadHandler;
}>();

const emit = defineEmits<{
  (event: "update", block: ImageBlock): void;
}>();

const updateUrl = (event: Event) => {
  const input = event.target as HTMLInputElement;
  const nextUrl = input.value;
  emit("update", {
    ...props.block,
    url: nextUrl,
    status: nextUrl ? "ready" : "pending"
  });
};

const updateWidth = (event: Event) => {
  const input = event.target as HTMLInputElement;
  const widthPx = input.value ? Number(input.value) : undefined;
  emit("update", {
    ...props.block,
    display: {
      ...props.block.display,
      widthPx
    }
  });
};

const updateHeight = (event: Event) => {
  const input = event.target as HTMLInputElement;
  const heightPx = input.value ? Number(input.value) : undefined;
  emit("update", {
    ...props.block,
    display: {
      ...props.block.display,
      heightPx
    }
  });
};

const updateAlign = (align: ImageAlign) => {
  emit("update", {
    ...props.block,
    display: {
      ...props.block.display,
      align
    }
  });
};

const handleFileChange = async (event: Event) => {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  if (!file || !props.onImageUpload) {
    return;
  }

  // Set status to uploading
  emit("update", { ...props.block, status: "uploading" });

  try {
    const url = await props.onImageUpload(file);
    emit("update", {
      ...props.block,
      url,
      status: "ready"
    });
  } catch {
    emit("update", { ...props.block, status: "error" });
  }

  // Reset file input
  input.value = "";
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

.ee-image-source {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.ee-file-input {
  font-size: 12px;
}

.ee-url-input {
  width: 100%;
  padding: 8px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  box-sizing: border-box;
}

.ee-dimensions-row {
  display: flex;
  gap: 8px;
}

.ee-dimension-input {
  flex: 1;
  position: relative;
  display: flex;
  align-items: center;
}

.ee-label-sm {
  position: absolute;
  left: 8px;
  font-size: 10px;
  color: #9ca3af;
  font-weight: 600;
}

.ee-dimension-input input {
  width: 100%;
  padding: 6px 6px 6px 24px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 13px;
  box-sizing: border-box;
}

.ee-align-options {
  display: flex;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  overflow: hidden;
}

.ee-align-options button {
  flex: 1;
  border: none;
  background: #fff;
  padding: 6px 4px;
  font-size: 12px;
  cursor: pointer;
  color: #4b5563;
  border-right: 1px solid #e5e7eb;
}

.ee-align-options button:last-child {
  border-right: none;
}

.ee-align-options button.active {
  background: #f3f4f6;
  color: #111827;
  font-weight: 500;
}

.ee-status {
  margin-top: 4px;
  font-size: 12px;
  color: #6b7280;
}

.ee-status.error {
  color: #ef4444;
}
</style>
