<template>
  <div class="ee-canvas-table-block">
    <table class="ee-table">
      <tbody>
        <tr v-for="row in block.rows" :key="row.id">
          <td
            v-for="(cell, index) in row.cells"
            :key="cell.id"
            class="ee-table-cell"
            :style="getCellStyle(row, index)"
          >
            <div v-if="cell.blocks.length === 0" class="ee-cell-empty">
              Empty cell
            </div>
            <div
              v-for="cellBlock in cell.blocks"
              :key="cellBlock.id"
              class="ee-cell-block-wrapper"
              :class="{ 'is-selected': selectedCellBlockId === cellBlock.id }"
              @click.stop="handleCellBlockClick(cell.id, cellBlock.id)"
            >
              <div v-html="renderSingleBlock(cellBlock)"></div>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import type { CellBlock, TableBlock, TableRow } from "../../core/types";
import { renderBlockHtml } from "../../rendering/html_renderer";
import { resolveCellWidths } from "../../core/table_utils";

const props = defineProps<{
  block: TableBlock;
  selectedCellBlockId?: string | null;
}>();

const emit = defineEmits<{
  (event: "select-cell-block", cellId: string, blockId: string): void;
}>();

const handleCellBlockClick = (cellId: string, blockId: string) => {
  emit("select-cell-block", cellId, blockId);
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

const BLOCKED_TAGS = [
  "script",
  "iframe",
  "object",
  "embed",
  "link",
  "meta",
  "base",
  "form"
].join(",");

const URL_ATTRS = new Set(["href", "src", "xlink:href", "formaction"]);
const JAVASCRIPT_URL_RE = /^\s*javascript:/i;

const sanitizeHtml = (html: string): string => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");

  doc.querySelectorAll(BLOCKED_TAGS).forEach((el) => el.remove());

  const walker = doc.createTreeWalker(doc.body, NodeFilter.SHOW_ELEMENT);
  let currentNode = walker.currentNode as Element | null;

  while (currentNode) {
    for (const attr of Array.from(currentNode.attributes)) {
      const name = attr.name.toLowerCase();
      const value = attr.value;

      if (name.startsWith("on")) {
        currentNode.removeAttribute(attr.name);
        continue;
      }

      if (name === "style") {
        currentNode.removeAttribute(attr.name);
        continue;
      }

      if (URL_ATTRS.has(name) && JAVASCRIPT_URL_RE.test(value)) {
        currentNode.removeAttribute(attr.name);
      }
    }

    currentNode = walker.nextNode() as Element | null;
  }

  return doc.body.innerHTML;
};

const renderSingleBlock = (block: CellBlock): string => {
  if (block.type === "html") {
    return sanitizeHtml(block.content);
  }
  return renderBlockHtml(block);
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

.ee-cell-empty {
  font-size: 12px;
  color: #9ca3af;
  text-align: center;
  padding: 12px;
  border: 1px dashed #e5e7eb;
  border-radius: 6px;
  background: #f9fafb;
}

.ee-cell-block-wrapper {
  cursor: pointer;
  border-radius: 4px;
  transition: outline 0.15s ease;
}

.ee-cell-block-wrapper:hover {
  outline: 2px solid #93c5fd;
}

.ee-cell-block-wrapper.is-selected {
  outline: 2px solid #2563eb;
}
</style>
