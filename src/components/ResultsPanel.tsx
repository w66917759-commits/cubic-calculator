"use client";

import { AlertTriangle, Scale } from "lucide-react";
import { convertFromM3, formatNumber, formatVolume, unitLabel } from "@/lib/calculator/units";
import type {
  CalculatorProject,
  ProjectCalculationResult,
  VolumeUnit,
} from "@/lib/calculator/types";
import { CopyResultButton } from "./CopyResultButton";
import { FormulaBreakdown } from "./FormulaBreakdown";
import { ShareButton } from "./ShareButton";

interface ResultsPanelProps {
  project: CalculatorProject;
  result: ProjectCalculationResult;
}

function sceneResultTitle(project: CalculatorProject) {
  switch (project.scene) {
    case "cubic_feet":
      return "Cubic feet";
    case "cubic_yards":
      return "Cubic yards";
    case "shipping":
      return "Final CBM";
    case "concrete":
      return "Concrete volume";
    case "room":
      return "Room volume";
    case "tank":
      return "Tank capacity";
    case "soil":
      return "Material estimate";
    default:
      return "Final volume";
  }
}

function headlineVolume(project: CalculatorProject, result: ProjectCalculationResult) {
  switch (project.scene) {
    case "cubic_feet": {
      const unit: VolumeUnit = "ft3";
      return {
        value: convertFromM3(result.finalVolumeM3, unit),
        unitLabel: unitLabel(unit),
      };
    }
    case "cubic_yards": {
      const unit: VolumeUnit = "yd3";
      return {
        value: convertFromM3(result.finalVolumeM3, unit),
        unitLabel: unitLabel(unit),
      };
    }
    default:
      return {
        value: result.finalVolumeM3,
        unitLabel: "m³",
      };
  }
}

function primaryStats(project: CalculatorProject, result: ProjectCalculationResult) {
  switch (project.scene) {
    case "cubic_feet":
      return [
        { label: "Cubic yards", value: formatVolume(convertFromM3(result.finalVolumeM3, "yd3"), "yd3" as VolumeUnit) },
        { label: "Cubic meters", value: formatVolume(result.finalVolumeM3, "m3" as VolumeUnit) },
        { label: "Components", value: formatNumber(project.components.length) },
      ];
    case "cubic_yards":
      return [
        { label: "Cubic feet", value: formatVolume(convertFromM3(result.finalVolumeM3, "ft3"), "ft3" as VolumeUnit) },
        { label: "Cubic meters", value: formatVolume(result.finalVolumeM3, "m3" as VolumeUnit) },
        { label: "Components", value: formatNumber(project.components.length) },
      ];
    case "shipping": {
      const stats = [
        { label: "Cubic feet", value: formatVolume(convertFromM3(result.finalVolumeM3, "ft3"), "ft3" as VolumeUnit) },
        { label: "Total quantity", value: formatNumber(result.shipping?.totalQuantity ?? 0) },
        {
          label: "Volumetric weight",
          value: `${formatNumber(result.shipping?.totalVolumetricWeightKg ?? 0)} kg`,
        },
      ];

      if (result.shipping?.actualWeightKg !== undefined) {
        stats.push({
          label: "Chargeable weight",
          value: `${formatNumber(result.shipping.chargeableWeightKg ?? 0)} kg`,
        });
      }

      return stats;
    }
    case "concrete":
      return [
        { label: "Cubic yards", value: formatVolume(convertFromM3(result.finalVolumeM3, "yd3"), "yd3" as VolumeUnit) },
        { label: "Waste included", value: `${formatNumber(result.wasteVolumeM3)} m³` },
        {
          label: "Estimated weight",
          value: result.weight ? `${formatNumber(result.weight.kg)} kg` : "Set material",
        },
      ];
    case "room":
      return [
        { label: "Cubic feet", value: formatVolume(convertFromM3(result.finalVolumeM3, "ft3"), "ft3" as VolumeUnit) },
        { label: "Net volume", value: `${formatNumber(result.netVolumeM3)} m³` },
        { label: "Components", value: formatNumber(project.components.length) },
      ];
    case "tank":
      return [
        { label: "Liters", value: formatVolume(convertFromM3(result.finalVolumeM3, "l"), "l" as VolumeUnit) },
        { label: "US gallons", value: formatVolume(convertFromM3(result.finalVolumeM3, "gal_us"), "gal_us" as VolumeUnit) },
        {
          label: "Estimated weight",
          value: result.weight ? `${formatNumber(result.weight.kg)} kg` : "Set material",
        },
      ];
    case "soil":
      return [
        { label: "Cubic yards", value: formatVolume(convertFromM3(result.finalVolumeM3, "yd3"), "yd3" as VolumeUnit) },
        { label: "Liters", value: formatVolume(convertFromM3(result.finalVolumeM3, "l"), "l" as VolumeUnit) },
        { label: "Waste included", value: `${formatNumber(result.wasteVolumeM3)} m³` },
      ];
    default:
      return [
        { label: "Net volume", value: `${formatNumber(result.netVolumeM3)} m³` },
        { label: "Waste volume", value: `${formatNumber(result.wasteVolumeM3)} m³` },
        { label: "Components", value: formatNumber(project.components.length) },
      ];
  }
}

export function ResultsPanel({ project, result }: ResultsPanelProps) {
  const stats = primaryStats(project, result);
  const hasChecks = result.errors.length > 0 || result.warnings.length > 0;
  const headline = headlineVolume(project, result);

  return (
    <aside className="result-card" aria-label="Calculation results">
      <div className="result-headline">
        <p className="eyebrow">Live result</p>
        <strong className="result-number" aria-live="polite">
          {formatNumber(headline.value)}
          <span className="result-unit">{headline.unitLabel}</span>
        </strong>
        <p className="result-caption">{sceneResultTitle(project)}</p>
      </div>

      <dl className="stat-grid">
        {stats.map((stat) => (
          <div key={stat.label}>
            <dt>{stat.label}</dt>
            <dd>{stat.value}</dd>
          </div>
        ))}
      </dl>

      <div className="result-actions">
        <CopyResultButton project={project} result={result} />
        <ShareButton project={project} />
      </div>

      {result.weight && project.scene !== "concrete" && project.scene !== "tank" ? (
        <div className="estimate-card">
          <h3>
            <Scale size={15} aria-hidden />
            Estimated weight
          </h3>
          <p>{formatNumber(result.weight.kg)} kg</p>
          <span>
            {formatNumber(result.weight.metricTons)} metric tons · {formatNumber(result.weight.lb)} lb
          </span>
          <span>Density: {formatNumber(result.weight.densityKgPerM3)} kg/m³</span>
        </div>
      ) : null}

      {result.cost ? (
        <div className="estimate-card">
          <h3>Estimated cost</h3>
          <p>
            {formatNumber(result.cost.amount, 2)} {result.cost.currency}
          </p>
        </div>
      ) : null}

      {hasChecks ? (
        <div className="warnings" role="alert">
          <h3>
            <AlertTriangle size={15} aria-hidden />
            Checks
          </h3>
          {[...result.errors, ...result.warnings].map((message) => (
            <p key={message}>{message}</p>
          ))}
        </div>
      ) : null}

      <div className="result-details-group">
        <details className="disclosure">
          <summary>All units</summary>
          <div className="converted-list">
            {Object.entries(result.convertedVolumes).map(([unit, value]) => (
              <div key={unit}>
                <span>{unitLabel(unit as VolumeUnit)}</span>
                <strong>{formatVolume(value ?? 0, unit as VolumeUnit)}</strong>
              </div>
            ))}
          </div>
        </details>

        <details className="disclosure">
          <summary>Component breakdown</summary>
          <div className="breakdown-list">
            {result.componentResults.map((component) => (
              <div key={component.componentId}>
                <span>{component.name}</span>
                <strong>{formatNumber(component.signedVolumeM3)} m³</strong>
              </div>
            ))}
            <div>
              <span>Waste volume</span>
              <strong>{formatNumber(result.wasteVolumeM3)} m³</strong>
            </div>
          </div>
        </details>

        <details className="disclosure">
          <summary>Formula</summary>
          <FormulaBreakdown result={result} />
        </details>
      </div>
    </aside>
  );
}
