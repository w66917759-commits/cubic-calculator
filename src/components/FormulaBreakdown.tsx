"use client";

import { formatNumber } from "@/lib/calculator/units";
import type { ProjectCalculationResult } from "@/lib/calculator/types";

interface FormulaBreakdownProps {
  result: ProjectCalculationResult;
}

export function FormulaBreakdown({ result }: FormulaBreakdownProps) {
  return (
    <div className="formula-block">
      <h3>Formula breakdown</h3>
      <div className="formula-lines">
        {result.componentResults.map((component) => (
          <div className="formula-line" key={component.componentId}>
            <span>{component.name}</span>
            <code>
              {component.signedVolumeM3 < 0 ? "- " : ""}
              {component.formula}
            </code>
          </div>
        ))}
      </div>
      <pre>{result.formula}</pre>
      <div className="formula-total">
        <span>Waste volume</span>
        <strong>{formatNumber(result.wasteVolumeM3)} m³</strong>
      </div>
    </div>
  );
}
