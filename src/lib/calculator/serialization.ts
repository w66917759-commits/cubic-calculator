import { normalizeProjectAssembly } from "./assembly";
import type { CalculatorProject } from "./types";

export function encodeProjectState(project: CalculatorProject): string {
  const json = JSON.stringify(project);
  return encodeURIComponent(btoa(unescape(encodeURIComponent(json))));
}

export function decodeProjectState(value: string): CalculatorProject | null {
  try {
    const json = decodeURIComponent(escape(atob(decodeURIComponent(value))));
    return normalizeProjectAssembly(JSON.parse(json) as CalculatorProject);
  } catch {
    return null;
  }
}
