import { Input } from "./strategies/strategy-interface";

export type Selection = {
  start: number;
  end: number;
  delta?: number;
};

export function get(element: Input): Selection {
  const start = element.selectionStart || 0;
  const end = element.selectionEnd || 0;

  return {
    start,
    end,
    delta: Math.abs(end - start),
  };
}

export function set(element: Input, start: number, end: number): void {
  // Some browsers explode if you use setSelectionRange
  // on a non-focused element
  if (document.activeElement === element && element.setSelectionRange) {
    element.setSelectionRange(start, end);
  }
}
