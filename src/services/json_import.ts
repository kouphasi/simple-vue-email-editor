import { Document } from "../core/types";

export const parseDocument = (json: string): Document => {
  return JSON.parse(json) as Document;
};
