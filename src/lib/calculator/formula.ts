import { getShapeDefinition } from "./shapes";
import { formatNumber } from "./units";
import type {
  CalculatorProject,
  ComponentCalculationResult,
  ShapeComponent,
} from "./types";

function value(component: ShapeComponent, key: string): string {
  return formatNumber(component.dimensions[key], 6);
}

export function generateComponentFormula(
  component: ShapeComponent,
  totalVolumeM3: number,
): string {
  const qty = component.quantity !== 1 ? ` × ${formatNumber(component.quantity)}` : "";
  let expression: string;

  switch (component.shape) {
    case "box":
      expression = `${value(component, "length")} × ${value(component, "width")} × ${value(component, "height")}`;
      break;
    case "cube":
      expression = `${value(component, "side")}³`;
      break;
    case "cylinder":
      expression = `π × ${value(component, "radius")}² × ${value(component, "height")}`;
      break;
    case "tube":
      expression = `π × (${value(component, "outerRadius")}² - ${value(component, "innerRadius")}²) × ${value(component, "height")}`;
      break;
    case "cone":
      expression = `(1 / 3) × π × ${value(component, "radius")}² × ${value(component, "height")}`;
      break;
    case "frustum":
      expression = `(1 / 3) × π × ${value(component, "height")} × (${value(component, "radiusTop")}² + ${value(component, "radiusTop")} × ${value(component, "radiusBottom")} + ${value(component, "radiusBottom")}²)`;
      break;
    case "sphere":
      expression = `(4 / 3) × π × ${value(component, "radius")}³`;
      break;
    case "hemisphere":
      expression = `(2 / 3) × π × ${value(component, "radius")}³`;
      break;
    case "half_cylinder":
      expression = `(1 / 2) × π × ${value(component, "radius")}² × ${value(component, "length")}`;
      break;
    case "triangular_prism":
      expression = `(1 / 2) × ${value(component, "base")} × ${value(component, "triangleHeight")} × ${value(component, "length")}`;
      break;
    case "trapezoidal_prism":
      expression = `((${value(component, "topWidth")} + ${value(component, "bottomWidth")}) / 2) × ${value(component, "height")} × ${value(component, "length")}`;
      break;
    case "rectangle_semicircle":
      expression = `(${value(component, "rectLength")} × ${value(component, "width")} + (1 / 2) × π × ${value(component, "radius")}²) × ${value(component, "height")}`;
      break;
    case "rectangle_trapezoid":
      expression = `${value(component, "rectLength")} × ${value(component, "rectWidth")} × ${value(component, "height")} + ((${value(component, "trapTopWidth")} + ${value(component, "trapBottomWidth")}) / 2) × ${value(component, "trapLength")} × ${value(component, "height")}`;
      break;
    case "l_shape":
      expression = `(${value(component, "mainLength")} × ${value(component, "mainWidth")} + ${value(component, "legLength")} × ${value(component, "legWidth")}) × ${value(component, "height")}`;
      break;
    case "t_shape":
      expression = `(${value(component, "stemLength")} × ${value(component, "stemWidth")} + ${value(component, "crossLength")} × ${value(component, "crossWidth")}) × ${value(component, "height")}`;
      break;
    case "stepped_boxes":
      expression = `${value(component, "lowerLength")} × ${value(component, "lowerWidth")} × ${value(component, "lowerHeight")} + ${value(component, "upperLength")} × ${value(component, "upperWidth")} × ${value(component, "upperHeight")}`;
      break;
    case "stacked_boxes":
      expression = `${value(component, "bottomLength")} × ${value(component, "bottomWidth")} × ${value(component, "bottomHeight")} + ${value(component, "topLength")} × ${value(component, "topWidth")} × ${value(component, "topHeight")}`;
      break;
    case "box_cylinder_stack":
      expression = `${value(component, "baseLength")} × ${value(component, "baseWidth")} × ${value(component, "baseHeight")} + π × ${value(component, "radius")}² × ${value(component, "cylinderHeight")}`;
      break;
    case "box_trapezoid_sump":
      expression = `${value(component, "boxLength")} × ${value(component, "boxWidth")} × ${value(component, "boxHeight")} + ((${value(component, "sumpTopWidth")} + ${value(component, "sumpBottomWidth")}) / 2) × ${value(component, "sumpHeight")} × ${value(component, "sumpDepth")}`;
      break;
    default:
      expression = getShapeDefinition(component.shape).label;
  }

  return `${expression}${qty} = ${formatNumber(totalVolumeM3)} m³`;
}

export function generateProjectFormula(
  componentResults: ComponentCalculationResult[],
  project: CalculatorProject,
): string {
  const active = componentResults.filter((result) => result.enabled && result.valid);

  if (active.length === 0) {
    return "No valid enabled components.";
  }

  const netExpression = active
    .map((result, index) => {
      const absolute = formatNumber(Math.abs(result.totalVolumeM3));
      const sign = result.signedVolumeM3 < 0 ? "-" : "+";
      return index === 0 && sign === "+" ? absolute : `${sign} ${absolute}`;
    })
    .join(" ");

  const net = active.reduce((sum, result) => sum + result.signedVolumeM3, 0);
  const lines = [`Net volume: ${netExpression} = ${formatNumber(net)} m³`];

  if (project.wasteFactorPercent > 0 && net > 0) {
    lines.push(
      `With ${formatNumber(project.wasteFactorPercent)}% waste: ${formatNumber(net)} × ${formatNumber(
        1 + project.wasteFactorPercent / 100,
      )} = ${formatNumber(net * (1 + project.wasteFactorPercent / 100))} m³`,
    );
  }

  return lines.join("\n");
}
