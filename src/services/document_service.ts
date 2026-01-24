import {
  Block,
  Document,
  LayoutSettings,
  PreviewMode,
  PREVIEW_WIDTHS
} from "../core/types";

export const createLayoutSettings = (mode: PreviewMode): LayoutSettings => {
  return {
    previewMode: mode,
    previewWidthPx: PREVIEW_WIDTHS[mode]
  };
};

export const createDocument = (id: string): Document => {
  return {
    id,
    blocks: [],
    layout: createLayoutSettings("mobile")
  };
};

export const setLayout = (document: Document, layout: LayoutSettings): Document => {
  return {
    ...document,
    layout
  };
};

export const setPreviewMode = (document: Document, mode: PreviewMode): Document => {
  return setLayout(document, createLayoutSettings(mode));
};

export const addBlock = (document: Document, block: Block): Document => {
  return {
    ...document,
    blocks: [...document.blocks, block]
  };
};

export const updateBlock = (
  document: Document,
  blockId: string,
  updater: (block: Block) => Block
): Document => {
  const blocks = document.blocks.map((block) =>
    block.id === blockId ? updater(block) : block
  );

  return {
    ...document,
    blocks
  };
};

export const replaceBlock = (document: Document, blockId: string, next: Block): Document => {
  return updateBlock(document, blockId, () => next);
};

export const deleteBlock = (document: Document, blockId: string): Document => {
  return {
    ...document,
    blocks: document.blocks.filter((block) => block.id !== blockId)
  };
};

export const reorderBlocks = (
  document: Document,
  fromIndex: number,
  toIndex: number
): Document => {
  if (fromIndex === toIndex) {
    return document;
  }

  const blocks = [...document.blocks];
  if (
    fromIndex < 0 ||
    toIndex < 0 ||
    fromIndex >= blocks.length ||
    toIndex >= blocks.length
  ) {
    return document;
  }

  const [moved] = blocks.splice(fromIndex, 1);
  if (!moved) {
    return document;
  }
  blocks.splice(toIndex, 0, moved);

  return {
    ...document,
    blocks
  };
};
