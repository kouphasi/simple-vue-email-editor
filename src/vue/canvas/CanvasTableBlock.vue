<template>
  <div class="ee-canvas-table-block">
    <table class="ee-table">
      <tbody>
        <tr v-for="row in block.rows" :key="row.id">
          <td
            v-for="(cell, index) in row.cells"
            :key="cell.id"
            class="ee-table-cell"
            :class="{
              'is-drag-over': dragOverCellId === cell.id && dragOverState === 'allowed',
              'is-drop-disabled': dragOverCellId === cell.id && dragOverState === 'blocked'
            }"
            :style="getCellStyle(row, index)"
            @dragover="handleCellDragOver(cell, $event)"
            @dragleave="handleCellDragLeave(cell.id)"
            @drop="handleCellDrop(cell.id, $event)"
          >
            <div
              v-if="cell.blocks.length === 0"
              class="ee-cell-empty"
              :class="{
                'is-drag-over': dragOverCellId === cell.id && dragOverState === 'allowed',
                'is-drop-disabled': dragOverCellId === cell.id && dragOverState === 'blocked'
              }"
            >
              Empty cell
            </div>
            <CanvasBlock
              v-for="cellBlock in cell.blocks"
              :key="cellBlock.id"
              class="ee-cell-block-frame"
              :class="{
                'is-dragging': dragSource?.type === 'cell' && dragSource.blockId === cellBlock.id
              }"
              :selected="isCellBlockSelected(cellBlock.id)"
              @select="handleCellBlockClick(cell.id, cellBlock.id)"
              @dragstart="handleCellBlockDragStart(cell.id, cellBlock.id, $event)"
              @dragend="handleCellBlockDragEnd"
              @delete="handleCellBlockDelete(cell.id, cellBlock.id)"
            >
              <CanvasTextBlock
                v-if="cellBlock.type === 'text'"
                :block="cellBlock"
                :selected="isCellBlockSelected(cellBlock.id)"
                :editing="isCellBlockEditing(cellBlock.id)"
                :ref="registerTextBlockRef ? registerTextBlockRef(cellBlock.id) : undefined"
                @update="handleCellBlockUpdate"
                @edit="handleCellBlockEdit(cell.id, cellBlock.id)"
                @select="handleCellBlockClick(cell.id, cellBlock.id)"
              />
              <div
                v-else-if="cellBlock.type === 'html' && !cellBlock.content"
                class="ee-html-placeholder"
              >
                Empty HTML Block
              </div>
              <div v-else v-html="renderSingleBlock(cellBlock)"></div>
            </CanvasBlock>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import type {
  BlockType,
  CellBlock,
  ImageBlock,
  TableBlock,
  TableCell,
  TableRow
} from "../../core/types";
import { renderBlockHtml } from "../../rendering/html_renderer";
import { sanitizePreviewHtml } from "../../rendering/html_sanitizer";
import { resolveCellWidths } from "../../core/table_utils";
import CanvasBlock from "./CanvasBlock.vue";
import CanvasTextBlock from "./CanvasTextBlock.vue";

type DragSource =
  | {
      type: "top-level";
      blockId: string;
      index: number;
      blockType: BlockType;
    }
  | {
      type: "cell";
      blockId: string;
      tableBlockId: string;
      cellId: string;
      blockType: BlockType;
    };

const props = defineProps<{
  block: TableBlock;
  selectedCellBlockId?: string | null;
  dragSource?: DragSource | null;
  isEditingText?: boolean;
  registerTextBlockRef?: (id: string) => (el: unknown) => void;
}>();

const emit = defineEmits<{
  (event: "select-cell-block", cellId: string, blockId: string): void;
  (event: "cell-block-drag-start", cellId: string, blockId: string, e: DragEvent): void;
  (event: "cell-block-drag-end"): void;
  (event: "cell-drop", cellId: string): void;
  (event: "cell-block-delete", cellId: string, blockId: string): void;
  (event: "update-cell-block", block: CellBlock): void;
  (event: "cell-block-edit", cellId: string, blockId: string): void;
}>();

const dragOverCellId = ref<string | null>(null);
const dragOverState = ref<"allowed" | "blocked" | null>(null);

const handleCellBlockClick = (cellId: string, blockId: string) => {
  emit("select-cell-block", cellId, blockId);
};

const handleCellBlockDragStart = (cellId: string, blockId: string, event: DragEvent) => {
  emit("cell-block-drag-start", cellId, blockId, event);
};

const handleCellBlockDragEnd = () => {
  emit("cell-block-drag-end");
};

const handleCellBlockDelete = (cellId: string, blockId: string) => {
  emit("cell-block-delete", cellId, blockId);
};

const handleCellBlockUpdate = (block: CellBlock) => {
  emit("update-cell-block", block);
};

const handleCellBlockEdit = (cellId: string, blockId: string) => {
  emit("cell-block-edit", cellId, blockId);
};

const isCellBlockSelected = (blockId: string): boolean => {
  return props.selectedCellBlockId === blockId;
};

const isCellBlockEditing = (blockId: string): boolean => {
  return Boolean(props.isEditingText && props.selectedCellBlockId === blockId);
};

const getCellStyle = (row: TableRow, index: number): Record<string, string> => {
  const padding = Number.isFinite(props.block.cellPadding ?? undefined)
    ? String(props.block.cellPadding ?? 8)
    : "8";
  const widths = resolveCellWidths(row, props.block.columnCount);
  const width = widths[index] ?? (props.block.columnCount > 0 ? 100 / props.block.columnCount : 100);
  return {
    width: `${width}%`,
    padding: `${padding}px`,
    verticalAlign: "top"
  };
};

const isDragSourceCell = (cellId: string): boolean => {
  return (
    props.dragSource?.type === "cell" &&
    props.dragSource.tableBlockId === props.block.id &&
    props.dragSource.cellId === cellId
  );
};

const isDropAllowed = (cell: TableCell): boolean => {
  if (!props.dragSource) {
    return false;
  }
  if (cell.blocks.length > 0) {
    return false;
  }
  if (props.dragSource.blockType === "table" || props.dragSource.blockType === "custom") {
    return false;
  }
  if (isDragSourceCell(cell.id)) {
    return false;
  }
  return true;
};

const handleCellDragOver = (cell: TableCell, event: DragEvent) => {
  if (!props.dragSource) {
    dragOverCellId.value = null;
    dragOverState.value = null;
    return;
  }
  if (isDragSourceCell(cell.id)) {
    dragOverCellId.value = cell.id;
    dragOverState.value = "blocked";
    event.preventDefault();
    event.stopPropagation();
    return;
  }
  const allowed = isDropAllowed(cell);
  dragOverCellId.value = cell.id;
  dragOverState.value = allowed ? "allowed" : "blocked";
  if (allowed) {
    event.preventDefault();
    event.stopPropagation();
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = "move";
    }
  }
};

const handleCellDragLeave = (cellId: string) => {
  if (dragOverCellId.value === cellId) {
    dragOverCellId.value = null;
    dragOverState.value = null;
  }
};

const handleCellDrop = (cellId: string, event: DragEvent) => {
  if (!props.dragSource) {
    return;
  }
  const cell = findCell(cellId);
  if (cell && isDragSourceCell(cell.id)) {
    event.preventDefault();
    event.stopPropagation();
    dragOverCellId.value = null;
    dragOverState.value = null;
    return;
  }
  if (!cell || !isDropAllowed(cell)) {
    dragOverCellId.value = null;
    dragOverState.value = null;
    return;
  }
  event.preventDefault();
  event.stopPropagation();
  emit("cell-drop", cellId);
  dragOverCellId.value = null;
  dragOverState.value = null;
};

const findCell = (cellId: string): TableCell | null => {
  for (const row of props.block.rows) {
    const cell = row.cells.find((item) => item.id === cellId);
    if (cell) {
      return cell;
    }
  }
  return null;
};

watch(
  () => props.dragSource,
  (next) => {
    if (!next) {
      dragOverCellId.value = null;
      dragOverState.value = null;
    }
  }
);

const renderImagePlaceholder = (block: ImageBlock): string => {
  const message =
    block.status === "uploading"
      ? "Uploading..."
      : block.status === "error"
        ? "Error loading image"
        : "No image selected";
  return `<div class="ee-image-placeholder"><span>${message}</span></div>`;
};

const renderSingleBlock = (block: CellBlock): string => {
  if (block.type === "html") {
    return sanitizePreviewHtml(block.content);
  }
  if (block.type === "image" && (!block.url || block.status !== "ready")) {
    return renderImagePlaceholder(block);
  }
  return sanitizePreviewHtml(renderBlockHtml(block), {
    stripStyleAttributes: false
  });
};
</script>

<style scoped>
.ee-canvas-table-block {
  margin: 0 0 16px 0;
}

.ee-table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
  background: #ffffff;
}

.ee-table-cell {
  border: 1px dashed #e5e7eb;
  box-sizing: border-box;
}

.ee-table-cell.is-drag-over {
  background: #eff6ff;
  outline: 2px dashed #2563eb;
  outline-offset: -2px;
}

.ee-table-cell.is-drop-disabled {
  background: #fef2f2;
  outline: 2px dashed #ef4444;
  outline-offset: -2px;
}

.ee-cell-empty {
  font-size: 12px;
  color: #9ca3af;
  text-align: center;
  padding: 12px;
  border: 1px dashed #e5e7eb;
  border-radius: 6px;
  background: #f9fafb;
}

.ee-cell-empty.is-drag-over {
  background: #dbeafe;
  border-color: #2563eb;
}

.ee-cell-empty.is-drop-disabled {
  background: #fee2e2;
  border-color: #ef4444;
}

:deep(.ee-image-placeholder) {
  width: 100%;
  height: 120px;
  background: #f3f4f6;
  border: 2px dashed #d1d5db;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6b7280;
  font-size: 14px;
}

.ee-cell-block-frame {
  margin-bottom: 0;
}

.ee-cell-block-frame.is-dragging {
  opacity: 0.5;
}

.ee-html-placeholder {
  padding: 24px;
  background: #f3f4f6;
  border: 1px dashed #d1d5db;
  border-radius: 4px;
  color: #9ca3af;
  text-align: center;
  font-size: 14px;
  font-style: italic;
}
</style>
