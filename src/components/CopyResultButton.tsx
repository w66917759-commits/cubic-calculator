"use client";

import { Check, Clipboard } from "lucide-react";
import { useState } from "react";
import { formatNumber, formatVolume, unitLabel } from "@/lib/calculator/units";
import type {
  CalculatorProject,
  ProjectCalculationResult,
  VolumeUnit,
} from "@/lib/calculator/types";

interface CopyResultButtonProps {
  project: CalculatorProject;
  result: ProjectCalculationResult;
}

export function CopyResultButton({ project, result }: CopyResultButtonProps) {
  const [copied, setCopied] = useState(false);
  const primaryUnit = project.outputUnits[0] ?? "m3";

  async function copyResult() {
    const converted = Object.entries(result.convertedVolumes)
      .map(([unit, value]) => `- ${formatVolume(value ?? 0, unit as VolumeUnit)}`)
      .join("\n");
    const weight = result.weight
      ? `\nWeight:\n- Density: ${formatNumber(result.weight.densityKgPerM3)} kg/m³\n- Estimated weight: ${formatNumber(result.weight.kg)} kg`
      : "";
    const text = `Cubic Calculator Result

Net volume: ${formatNumber(result.netVolumeM3)} m³
Waste factor: ${formatNumber(project.wasteFactorPercent)}%
Final volume: ${formatNumber(result.finalVolumeM3)} m³

Converted:
${converted}
${weight}

Formula:
${result.formula}`;

    await navigator.clipboard.writeText(text);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  return (
    <button className="icon-button secondary" type="button" onClick={copyResult} title="Copy result">
      {copied ? <Check size={16} aria-hidden /> : <Clipboard size={16} aria-hidden />}
      {copied ? "Copied" : `Copy result (${unitLabel(primaryUnit)})`}
    </button>
  );
}
