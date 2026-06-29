import { getShapeDefinition } from "./shapes";
import type { CalculatorProject, ShapeComponent } from "./types";

export function validateComponent(component: ShapeComponent): string[] {
  if (!component.enabled) {
    return [];
  }

  const errors: string[] = [];
  const shape = getShapeDefinition(component.shape);

  for (const dimension of shape.dimensions) {
    const value = component.dimensions[dimension.key];
    if (!Number.isFinite(value) || value <= 0) {
      errors.push(`${dimension.label} must be greater than 0.`);
    }
  }

  if (!Number.isFinite(component.quantity) || component.quantity <= 0) {
    errors.push("Quantity must be greater than 0.");
  }

  if (
    component.shape === "tube" &&
    Number.isFinite(component.dimensions.innerRadius) &&
    Number.isFinite(component.dimensions.outerRadius) &&
    component.dimensions.innerRadius >= component.dimensions.outerRadius
  ) {
    errors.push("Inner radius must be smaller than outer radius.");
  }

  return errors;
}

export function validateProjectSettings(project: CalculatorProject): string[] {
  const errors: string[] = [];

  if (!Number.isFinite(project.wasteFactorPercent) || project.wasteFactorPercent < 0) {
    errors.push("Waste factor must be 0 or greater.");
  }

  if (
    project.material === "custom" &&
    (!Number.isFinite(project.customDensityKgPerM3) ||
      Number(project.customDensityKgPerM3) <= 0)
  ) {
    errors.push("Custom density must be greater than 0 kg/m³.");
  }

  if (project.cost?.enabled) {
    if (!Number.isFinite(project.cost.costPerVolume) || project.cost.costPerVolume < 0) {
      errors.push("Cost per volume must be 0 or greater.");
    }
  }

  if (project.shipping) {
    if (
      !Number.isFinite(project.shipping.volumetricDivisor) ||
      project.shipping.volumetricDivisor <= 0
    ) {
      errors.push("Volumetric divisor must be greater than 0.");
    }

    if (
      project.shipping.actualWeightKg !== undefined &&
      project.shipping.actualWeightKg < 0
    ) {
      errors.push("Actual weight must be 0 or greater.");
    }
  }

  return errors;
}
