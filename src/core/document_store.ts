import { Document } from "./types";

export type DocumentListener = (document: Document) => void;
export type DocumentUpdater = (document: Document) => Document;

export class DocumentStore {
  private current: Document;
  private listeners = new Set<DocumentListener>();

  constructor(initial: Document) {
    this.current = initial;
  }

  getDocument(): Document {
    return this.current;
  }

  setDocument(next: Document): void {
    this.current = next;
    this.emit();
  }

  update(updater: DocumentUpdater): void {
    this.current = updater(this.current);
    this.emit();
  }

  subscribe(listener: DocumentListener): () => void {
    this.listeners.add(listener);
    listener(this.current);

    return () => {
      this.listeners.delete(listener);
    };
  }

  private emit(): void {
    for (const listener of this.listeners) {
      listener(this.current);
    }
  }
}

export const createDocumentStore = (document: Document): DocumentStore => {
  return new DocumentStore(document);
};
