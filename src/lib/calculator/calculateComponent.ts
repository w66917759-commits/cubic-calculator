import { generateComponentFormula } from "./formula";
import { calculateShapeVolumeM3, getShapeDefinition } from "./shapes";
import { validateComponent } from "./validation";
import type { ComponentCalculationResult, ShapeComponent } from "./types";

export function calculateComponent(
  component: ShapeComponent,
): ComponentCalculationResult {
  const errors = validateComponent(component);
  const name = component.name.trim() || getShapeDefinition(component.shape).shortLabel;

  if (!component.enabled) {
    return {
      componentId: component.id,
      name,
      valid: true,
      enabled: false,
      errors: [],
      baseVolumeM3: 0,
      quantity: component.quantity,
      totalVolumeM3: 0,
      signedVolumeM3: 0,
      formula: "Disabled component.",
    };
  }

  if (errors.length > 0) {
    return {
      componentId: component.id,
      name,
      valid: false,
      enabled: true,
      errors,
      baseVolumeM3: 0,
      quantity: component.quantity,
      totalVolumeM3: 0,
      signedVolumeM3: 0,
      formula: errors.join(" "),
    };
  }

  const baseVolumeM3 = calculateShapeVolumeM3(
    component.shape,
    component.dimensions,
    component.unit,
  );
  const totalVolumeM3 = baseVolumeM3 * component.quantity;
  const signedVolumeM3 =
    component.operation === "add" ? totalVolumeM3 : -totalVolumeM3;

  return {
    componentId: component.id,
    name,
    valid: true,
    enabled: true,
    errors: [],
    baseVolumeM3,
    quantity: component.quantity,
    totalVolumeM3,
    signedVolumeM3,
    formula: generateComponentFormula(component, totalVolumeM3),
  };
}
