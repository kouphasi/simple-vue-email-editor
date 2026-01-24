import { TextRun } from "./types";

const HEX_COLOR_REGEX = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;

export function isValidHttpUrl(value: string): boolean {
  if (!value) {
    return false;
  }

  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export function isValidHexColor(value: string | null | undefined): boolean {
  if (value == null) {
    return true;
  }

  return HEX_COLOR_REGEX.test(value);
}

export function areTextRunsValid(text: string, runs: TextRun[]): boolean {
  if (!Array.isArray(runs)) {
    return false;
  }

  const length = text.length;
  let lastEnd = 0;

  for (const run of runs) {
    if (!Number.isInteger(run.start) || !Number.isInteger(run.end)) {
      return false;
    }

    if (run.start < 0 || run.end > length || run.end <= run.start) {
      return false;
    }

    if (run.start < lastEnd) {
      return false;
    }

    lastEnd = run.end;
  }

  return true;
}
