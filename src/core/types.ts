export type BlockType = "text" | "button" | "image" | "html";
export type PreviewMode = "mobile" | "desktop";
export type PreviewWidthPx = 375 | 640;

export interface LayoutSettings {
  previewMode: PreviewMode;
  previewWidthPx: PreviewWidthPx;
}

export interface Document {
  id: string;
  blocks: Block[];
  layout: LayoutSettings;
}

export interface BlockBase {
  id: string;
  type: BlockType;
}

export interface TextRun {
  start: number;
  end: number;
  bold: boolean;
  color: string | null;
}

export interface TextBlock extends BlockBase {
  type: "text";
  text: string;
  runs: TextRun[];
  align?: BlockAlign;
}

export type ButtonShape = "square" | "rounded" | "pill";

export interface ButtonBlock extends BlockBase {
  type: "button";
  label: string;
  url: string;
  shape: ButtonShape;
  textColor: string;
  backgroundColor: string;
  align?: BlockAlign;
}

export type ImageStatus = "pending" | "ready" | "uploading" | "error";
export type BlockAlign = "left" | "center" | "right";
export type ImageAlign = BlockAlign;

export interface ImageBlock extends BlockBase {
  type: "image";
  url: string;
  status: ImageStatus;
  display: {
    widthPx?: number;
    heightPx?: number;
    align?: BlockAlign;
  };
}

export interface HtmlBlock extends BlockBase {
  type: "html";
  content: string;
}

export type Block = TextBlock | ButtonBlock | ImageBlock | HtmlBlock;

export const PREVIEW_WIDTHS: Record<PreviewMode, PreviewWidthPx> = {
  mobile: 375,
  desktop: 640
};

export interface EditorState {
  selectedBlockId: string | null;
  isEditingText: boolean;
}
