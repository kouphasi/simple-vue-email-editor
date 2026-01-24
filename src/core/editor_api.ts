export type ImageUploadHandler = (file: File) => Promise<string>;
export type EditorErrorHandler = (error: Error) => void;
