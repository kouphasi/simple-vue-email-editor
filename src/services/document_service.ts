import {
  Block,
  CustomBlockDefinition,
  CustomBlockInstance,
  Document,
  LayoutSettings,
  PreviewMode,
  PREVIEW_WIDTHS
} from "../core/types";
import { getCustomBlockDefinition } from "../core/custom_block_registry";

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

export const updateLayout = setLayout;

export const setPreviewMode = (document: Document, mode: PreviewMode): Document => {
  return setLayout(document, createLayoutSettings(mode));
};

export const addBlock = (document: Document, block: Block): Document => {
  return {
    ...document,
    blocks: [...document.blocks, block]
  };
};

const createId = (): string => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `block_${Date.now()}_${Math.random().toString(16).slice(2)}`;
};

const isPlainObject = (value: unknown): value is Record<string, unknown> => {
  return typeof value === "object" && value !== null && !Array.isArray(value);
};

const deepMerge = (base: unknown, overrides: unknown): unknown => {
  if (Array.isArray(base) || Array.isArray(overrides)) {
    return overrides !== undefined ? overrides : base;
  }

  if (isPlainObject(base) && isPlainObject(overrides)) {
    const merged: Record<string, unknown> = { ...base };
    for (const [key, value] of Object.entries(overrides)) {
      merged[key] = deepMerge(base[key], value);
    }
    return merged;
  }

  return overrides !== undefined ? overrides : base;
};

const buildSchemaDefaults = (definition: CustomBlockDefinition): Record<string, unknown> => {
  const defaults: Record<string, unknown> = {};
  for (const field of definition.settingsSchema.fields) {
    if (field.default !== undefined) {
      defaults[field.key] = field.default;
    }
  }
  return defaults;
};

export const createCustomBlockInstance = (
  definitionId: string,
  overrides: Record<string, unknown> = {},
  id: string = createId()
): CustomBlockInstance => {
  const definition = getCustomBlockDefinition(definitionId);
  const baseConfig = definition
    ? deepMerge(buildSchemaDefaults(definition), definition.defaultConfig)
    : {};
  const config = deepMerge(baseConfig, overrides) as Record<string, unknown>;
  const state = definition ? "ready" : "missing-definition";

  return {
    id,
    type: "custom",
    definitionId,
    config,
    state,
    readOnly: state === "missing-definition"
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
