"use client";

import type { ReactNode } from "react";
import { Copy, Trash2 } from "lucide-react";
import { LENGTH_UNITS } from "@/lib/calculator/constants";
import { createDefaultDimensions, getShapeDefinition } from "@/lib/calculator/shapes";
import { formatNumber } from "@/lib/calculator/units";
import type {
  ComponentCalculationResult,
  LengthUnit,
  OperationType,
  ShapeComponent,
  ShapeType,
} from "@/lib/calculator/types";
import { DimensionInputs } from "./DimensionInputs";
import { ShapeSelector } from "./ShapeSelector";

interface ComponentCardProps {
  component: ShapeComponent;
  result?: ComponentCalculationResult;
  isActive: boolean;
  canDelete: boolean;
  showAdvanced?: boolean;
  shapeControl?: ReactNode;
  isSelected?: boolean;
  onChange: (component: ShapeComponent) => void;
  onEdit: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
}

export function ComponentCard({
  component,
  result,
  isActive,
  canDelete,
  showAdvanced = false,
  shapeControl,
  isSelected = false,
  onChange,
  onEdit,
  onDuplicate,
  onDelete,
}: ComponentCardProps) {
  const shapeDefinition = getShapeDefinition(component.shape);
  const signedVolume = result?.signedVolumeM3 ?? 0;
  const dimensionSummary = shapeDefinition.dimensions
    .map((dimension) => formatNumber(component.dimensions[dimension.key] ?? 0))
    .join(" x ");

  function updateShape(shape: ShapeType) {
    onChange({
      ...component,
      shape,
      dimensions: createDefaultDimensions(shape),
    });
  }

  function updateOperation(operation: OperationType) {
    onChange({
      ...component,
      operation,
    });
  }

  return (
    <article
      className={[
        "component-card",
        component.operation === "subtract" ? "subtract" : "add",
        isActive ? "expanded" : "compact-card",
        !component.enabled ? "disabled" : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {!isActive ? (
        <button
          className="component-summary"
          type="button"
          onClick={onEdit}
          aria-pressed={showAdvanced ? isSelected : undefined}
        >
          <span className="component-summary-name">
            <span>{component.name}</span>
            <small>{component.operation === "subtract" ? "Subtract volume" : "Add volume"}</small>
          </span>
          <span className="summary-cell">
            <span>Shape</span>
            <strong>{shapeDefinition.shortLabel}</strong>
          </span>
          <span className="summary-cell wide">
            <span>Dimensions</span>
            <strong>
              {dimensionSummary} {component.unit}
            </strong>
          </span>
          <span className="summary-cell volume-cell">
            <span>Volume</span>
            <strong>{formatNumber(signedVolume)} m³</strong>
          </span>
          <span className="summary-status">Edit</span>
        </button>
      ) : null}

      {isActive ? (
        <div className="component-expanded">
          <div className="active-component-title">
            <div>
              <p className="eyebrow">{component.operation === "subtract" ? "Subtract shape" : "Shape"}</p>
              <h3>{component.name}</h3>
            </div>
            <strong>{formatNumber(signedVolume)} m³</strong>
          </div>

          <div className="component-grid quick-fields">
            {shapeControl ?? <ShapeSelector value={component.shape} onChange={updateShape} />}
            <label className="field">
              <span>Input unit</span>
              <select
                value={component.unit}
                onChange={(event) =>
                  onChange({
                    ...component,
                    unit: event.target.value as LengthUnit,
                  })
                }
              >
                {LENGTH_UNITS.map((unit) => (
                  <option value={unit.id} key={unit.id}>
                    {unit.id}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <DimensionInputs
            component={component}
            onChange={(dimensions) => onChange({ ...component, dimensions })}
          />
        </div>
      ) : null}

      {showAdvanced ? (
        <details className="advanced-section">
          <summary>Item settings</summary>
          <div className="advanced-content">
            <div className="advanced-settings-grid">
              <label className="component-name">
                <span>Component name</span>
                <input
                  type="text"
                  value={component.name}
                  onChange={(event) => onChange({ ...component, name: event.target.value })}
                />
              </label>
              <label className="field">
                <span>Quantity</span>
                <input
                  aria-invalid={!Number.isFinite(component.quantity) || component.quantity <= 0}
                  min="0"
                  step="any"
                  type="number"
                  value={Number.isFinite(component.quantity) ? component.quantity : ""}
                  onChange={(event) =>
                    onChange({
                      ...component,
                      quantity: event.target.value === "" ? Number.NaN : Number(event.target.value),
                    })
                  }
                />
                {!Number.isFinite(component.quantity) || component.quantity <= 0 ? (
                  <small>Quantity must be greater than 0.</small>
                ) : null}
              </label>
              <label className="toggle">
                <input
                  type="checkbox"
                  checked={component.enabled}
                  onChange={(event) => onChange({ ...component, enabled: event.target.checked })}
                />
                <span>Enabled in result</span>
              </label>
            </div>
            <div className="operation-segmented" role="group" aria-label="Volume operation">
              <button
                className={component.operation === "add" ? "active" : ""}
                type="button"
                aria-pressed={component.operation === "add"}
                onClick={() => updateOperation("add")}
              >
                Add volume
              </button>
              <button
                className={component.operation === "subtract" ? "active" : ""}
                type="button"
                aria-pressed={component.operation === "subtract"}
                onClick={() => updateOperation("subtract")}
              >
                Subtract volume
              </button>
            </div>
            <div className="component-actions">
              <button className="secondary-action" type="button" onClick={onDuplicate} title="Duplicate component">
                <Copy size={16} aria-hidden />
                Duplicate
              </button>
              <button
                className="secondary-action danger"
                type="button"
                onClick={onDelete}
                disabled={!canDelete}
                title="Delete component"
              >
                <Trash2 size={16} aria-hidden />
                Delete
              </button>
            </div>
          </div>
        </details>
      ) : null}

      {result?.errors.length ? (
        <div className="component-errors" role="alert">
          {result.errors.map((error) => (
            <p key={error}>{error}</p>
          ))}
        </div>
      ) : null}
    </article>
  );
}
