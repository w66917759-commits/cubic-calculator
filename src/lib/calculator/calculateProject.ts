import { MATERIALS } from "./constants";
import { boundsIntersect, getComponentBounds } from "./assembly";
import { calculateComponent } from "./calculateComponent";
import { generateProjectFormula } from "./formula";
import { convertFromM3, lengthToMeters } from "./units";
import { validateProjectSettings } from "./validation";
import type {
  CalculatorProject,
  ComponentCalculationResult,
  ProjectCalculationResult,
  ShapeComponent,
} from "./types";

export function getMaterialDensity(project: CalculatorProject): number | null {
  if (project.material === "custom") {
    return project.customDensityKgPerM3 && project.customDensityKgPerM3 > 0
      ? project.customDensityKgPerM3
      : null;
  }

  return (
    MATERIALS.find((material) => material.id === project.material)
      ?.densityKgPerM3 ?? null
  );
}

function calculateCost(project: CalculatorProject, finalVolumeM3: number) {
  if (!project.cost?.enabled || project.cost.costPerVolume < 0) {
    return undefined;
  }

  return {
    amount:
      convertFromM3(finalVolumeM3, project.cost.volumeUnit) *
      project.cost.costPerVolume,
    currency: project.cost.currency,
  };
}

function getBoxDimensionCm(component: ShapeComponent, key: "length" | "width" | "height") {
  return lengthToMeters(component.dimensions[key], component.unit) / 0.01;
}

function calculateShippingResult(
  project: CalculatorProject,
  componentResults: ComponentCalculationResult[],
) {
  if (project.scene !== "shipping" || !project.shipping) {
    return undefined;
  }

  const divisor = project.shipping.volumetricDivisor;
  const resultByComponentId = new Map(
    componentResults.map((result) => [result.componentId, result]),
  );
  const totalVolumetricWeightKg = project.components.reduce((sum, component) => {
    const result = resultByComponentId.get(component.id);

    if (!component.enabled || !result?.valid || component.quantity <= 0) {
      return sum;
    }

    if (component.shape === "box") {
      return (
        sum +
        (getBoxDimensionCm(component, "length") *
          getBoxDimensionCm(component, "width") *
          getBoxDimensionCm(component, "height") *
          component.quantity) /
          divisor
      );
    }

    return sum + (result.totalVolumeM3 * 1_000_000) / divisor;
  }, 0);

  const totalQuantity = project.components.reduce(
    (sum, component) => (component.enabled ? sum + component.quantity : sum),
    0,
  );
  const actualWeightKg = project.shipping.actualWeightKg;

  return {
    totalVolumetricWeightKg,
    actualWeightKg,
    chargeableWeightKg:
      actualWeightKg !== undefined
        ? Math.max(actualWeightKg, totalVolumetricWeightKg)
        : undefined,
    totalQuantity,
  };
}

export function calculateProject(
  project: CalculatorProject,
): ProjectCalculationResult {
  const componentResults = project.components.map(calculateComponent);
  const validComponentResults = componentResults.filter(
    (result) => result.valid && result.enabled,
  );
  const settingsErrors = validateProjectSettings(project);
  const componentErrors = componentResults.flatMap((result) =>
    result.errors.map((error) => `${result.name}: ${error}`),
  );

  const netVolumeM3 = validComponentResults.reduce(
    (sum, result) => sum + result.signedVolumeM3,
    0,
  );
  const wasteVolumeM3 =
    netVolumeM3 > 0 ? netVolumeM3 * (project.wasteFactorPercent / 100) : 0;
  const finalVolumeM3 = netVolumeM3 + wasteVolumeM3;
  const convertedVolumes = Object.fromEntries(
    project.outputUnits.map((unit) => [unit, convertFromM3(finalVolumeM3, unit)]),
  );
  const warnings: string[] = [];
  const addVolumeM3 = validComponentResults
    .filter((result) => result.signedVolumeM3 >= 0)
    .reduce((sum, result) => sum + result.signedVolumeM3, 0);
  const subtractVolumeM3 = Math.abs(
    validComponentResults
      .filter((result) => result.signedVolumeM3 < 0)
      .reduce((sum, result) => sum + result.signedVolumeM3, 0),
  );

  if (netVolumeM3 < 0) {
    warnings.push("Net volume is negative. Check subtract components.");
  }

  if (subtractVolumeM3 > addVolumeM3) {
    warnings.push("Subtracted volume is larger than added volume.");
  }

  if (componentErrors.length > 0) {
    warnings.push("Some components are invalid and excluded from the result.");
  }

  const validEnabledIds = new Set(
    validComponentResults.map((result) => result.componentId),
  );
  const validEnabledComponents = project.components.filter((component) =>
    validEnabledIds.has(component.id),
  );
  const addedComponents = validEnabledComponents.filter(
    (component) => component.operation === "add",
  );
  const subtractComponents = validEnabledComponents.filter(
    (component) => component.operation === "subtract",
  );
  const addedBounds = addedComponents.map((component) => ({
    component,
    bounds: getComponentBounds(component),
  }));

  if (
    addedBounds.some((item, index) =>
      addedBounds
        .slice(index + 1)
        .some((other) => boundsIntersect(item.bounds, other.bounds)),
    )
  ) {
    warnings.push("Overlapping add shapes may be counted twice.");
  }

  for (const component of subtractComponents) {
    const subtractBounds = getComponentBounds(component);
    const intersectsAddedShape = addedBounds.some((item) =>
      boundsIntersect(subtractBounds, item.bounds),
    );

    if (!intersectsAddedShape) {
      warnings.push(`${component.name} does not intersect an added shape.`);
    }
  }

  const density = getMaterialDensity(project);
  const weight =
    density && finalVolumeM3 > 0
      ? {
          densityKgPerM3: density,
          kg: finalVolumeM3 * density,
          metricTons: (finalVolumeM3 * density) / 1000,
          lb: finalVolumeM3 * density * 2.20462262,
        }
      : undefined;

  return {
    valid: componentErrors.length === 0 && settingsErrors.length === 0,
    errors: [...componentErrors, ...settingsErrors],
    warnings,
    componentResults,
    netVolumeM3,
    finalVolumeM3,
    wasteVolumeM3,
    convertedVolumes,
    weight,
    cost: calculateCost(project, finalVolumeM3),
    shipping: calculateShippingResult(project, componentResults),
    formula: generateProjectFormula(componentResults, project),
  };
}
