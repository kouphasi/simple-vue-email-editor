import { Document } from "../core/types";
import { areTextRunsValid, isValidHexColor, isValidHttpUrl } from "../core/validation";
import { renderBlockHtml } from "../rendering/html_renderer";
import { wrapEmailHtml } from "../rendering/html_templates";

const validateForExport = (document: Document): string[] => {
  const errors: string[] = [];

  if (document.blocks.length === 0) {
    errors.push("Document must contain at least one block.");
  }

  for (const block of document.blocks) {
    if (block.type === "text") {
      if (!areTextRunsValid(block.text, block.runs)) {
        errors.push(`Invalid text runs for block ${block.id}`);
      }

      for (const run of block.runs) {
        if (!isValidHexColor(run.color)) {
          errors.push(`Invalid text color for block ${block.id}`);
          break;
        }
      }
    }

    if (block.type === "button") {
      if (!isValidHttpUrl(block.url)) {
        errors.push(`Invalid button URL for block ${block.id}`);
      }

      if (!isValidHexColor(block.textColor) || !isValidHexColor(block.backgroundColor)) {
        errors.push(`Invalid button colors for block ${block.id}`);
      }
    }

    if (block.type === "image") {
      if (!isValidHttpUrl(block.url)) {
        errors.push(`Invalid image URL for block ${block.id}`);
      }

      if (block.status !== "ready") {
        errors.push(`Image block ${block.id} is not ready for export`);
      }
    }
  }

  return errors;
};

export const exportHtml = (document: Document): string => {
  const errors = validateForExport(document);
  if (errors.length > 0) {
    throw new Error(errors.join("; "));
  }

  const content = document.blocks.map(renderBlockHtml).join("");
  return wrapEmailHtml(content, document.layout.previewWidthPx);
};
