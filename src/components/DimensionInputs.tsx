"use client";

import { getShapeDefinition } from "@/lib/calculator/shapes";
import type { ShapeComponent } from "@/lib/calculator/types";

interface DimensionInputsProps {
  component: ShapeComponent;
  onChange: (dimensions: Record<string, number>) => void;
}

export function DimensionInputs({ component, onChange }: DimensionInputsProps) {
  const shape = getShapeDefinition(component.shape);

  return (
    <div className="dimension-grid">
      {shape.dimensions.map((dimension) => {
        const value = component.dimensions[dimension.key];
        const invalid = !Number.isFinite(value) || value <= 0;

        return (
          <label className="field" key={dimension.key}>
            <span>{dimension.label}</span>
            <input
              aria-invalid={invalid}
              min="0"
              step="any"
              type="number"
              value={Number.isFinite(value) ? value : ""}
              placeholder={dimension.placeholder}
              onChange={(event) =>
                onChange({
                  ...component.dimensions,
                  [dimension.key]:
                    event.target.value === "" ? Number.NaN : Number(event.target.value),
                })
              }
            />
            {invalid ? <small>Value must be greater than 0.</small> : null}
          </label>
        );
      })}
    </div>
  );
}
