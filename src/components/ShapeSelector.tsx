"use client";

import { SHAPES } from "@/lib/calculator/constants";
import type { ShapeType } from "@/lib/calculator/types";

interface ShapeSelectorProps {
  value: ShapeType;
  onChange: (shape: ShapeType) => void;
}

export function ShapeSelector({ value, onChange }: ShapeSelectorProps) {
  return (
    <label className="field">
      <span>Shape</span>
      <select value={value} onChange={(event) => onChange(event.target.value as ShapeType)}>
        {SHAPES.map((shape) => (
          <option value={shape.id} key={shape.id}>
            {shape.label}
          </option>
        ))}
      </select>
    </label>
  );
}
