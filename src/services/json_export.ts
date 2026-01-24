import { Document } from "../core/types";

export const serializeDocument = (document: Document): string => {
  return JSON.stringify(document);
};
