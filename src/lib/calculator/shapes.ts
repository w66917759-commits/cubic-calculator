import { SHAPES } from "./constants";
import { lengthToMeters } from "./units";
import type { LengthUnit, ShapeType } from "./types";

export function getShapeDefinition(shape: ShapeType) {
  return SHAPES.find((definition) => definition.id === shape) ?? SHAPES[0];
}

export function createDefaultDimensions(shape: ShapeType): Record<string, number> {
  return Object.fromEntries(
    getShapeDefinition(shape).dimensions.map((dimension) => [
      dimension.key,
      Number(dimension.placeholder),
    ]),
  );
}

export function calculateShapeVolumeM3(
  shape: ShapeType,
  dimensions: Record<string, number>,
  unit: LengthUnit,
): number {
  const toM = (value: number) => lengthToMeters(value, unit);

  switch (shape) {
    case "box": {
      const l = toM(dimensions.length);
      const w = toM(dimensions.width);
      const h = toM(dimensions.height);
      return l * w * h;
    }
    case "cube": {
      const s = toM(dimensions.side);
      return s ** 3;
    }
    case "cylinder": {
      const r = toM(dimensions.radius);
      const h = toM(dimensions.height);
      return Math.PI * r ** 2 * h;
    }
    case "tube": {
      const outer = toM(dimensions.outerRadius);
      const inner = toM(dimensions.innerRadius);
      const h = toM(dimensions.height);
      return Math.PI * (outer ** 2 - inner ** 2) * h;
    }
    case "cone": {
      const r = toM(dimensions.radius);
      const h = toM(dimensions.height);
      return (Math.PI * r ** 2 * h) / 3;
    }
    case "frustum": {
      const r1 = toM(dimensions.radiusTop);
      const r2 = toM(dimensions.radiusBottom);
      const h = toM(dimensions.height);
      return (Math.PI * h * (r1 ** 2 + r1 * r2 + r2 ** 2)) / 3;
    }
    case "sphere": {
      const r = toM(dimensions.radius);
      return (4 * Math.PI * r ** 3) / 3;
    }
    case "hemisphere": {
      const r = toM(dimensions.radius);
      return (2 * Math.PI * r ** 3) / 3;
    }
    case "half_cylinder": {
      const r = toM(dimensions.radius);
      const l = toM(dimensions.length);
      return (Math.PI * r ** 2 * l) / 2;
    }
    case "triangular_prism": {
      const b = toM(dimensions.base);
      const th = toM(dimensions.triangleHeight);
      const l = toM(dimensions.length);
      return 0.5 * b * th * l;
    }
    case "trapezoidal_prism": {
      const top = toM(dimensions.topWidth);
      const bottom = toM(dimensions.bottomWidth);
      const h = toM(dimensions.height);
      const l = toM(dimensions.length);
      return ((top + bottom) / 2) * h * l;
    }
    case "rectangle_semicircle": {
      const rectLength = toM(dimensions.rectLength);
      const width = toM(dimensions.width);
      const radius = toM(dimensions.radius);
      const height = toM(dimensions.height);
      return (rectLength * width + (Math.PI * radius ** 2) / 2) * height;
    }
    case "rectangle_trapezoid": {
      const rectLength = toM(dimensions.rectLength);
      const rectWidth = toM(dimensions.rectWidth);
      const topWidth = toM(dimensions.trapTopWidth);
      const bottomWidth = toM(dimensions.trapBottomWidth);
      const trapLength = toM(dimensions.trapLength);
      const height = toM(dimensions.height);
      return (
        rectLength * rectWidth * height +
        ((topWidth + bottomWidth) / 2) * trapLength * height
      );
    }
    case "l_shape": {
      const mainLength = toM(dimensions.mainLength);
      const mainWidth = toM(dimensions.mainWidth);
      const legLength = toM(dimensions.legLength);
      const legWidth = toM(dimensions.legWidth);
      const height = toM(dimensions.height);
      return (mainLength * mainWidth + legLength * legWidth) * height;
    }
    case "t_shape": {
      const stemLength = toM(dimensions.stemLength);
      const stemWidth = toM(dimensions.stemWidth);
      const crossLength = toM(dimensions.crossLength);
      const crossWidth = toM(dimensions.crossWidth);
      const height = toM(dimensions.height);
      return (stemLength * stemWidth + crossLength * crossWidth) * height;
    }
    case "stepped_boxes": {
      return (
        toM(dimensions.lowerLength) *
          toM(dimensions.lowerWidth) *
          toM(dimensions.lowerHeight) +
        toM(dimensions.upperLength) *
          toM(dimensions.upperWidth) *
          toM(dimensions.upperHeight)
      );
    }
    case "stacked_boxes": {
      return (
        toM(dimensions.bottomLength) *
          toM(dimensions.bottomWidth) *
          toM(dimensions.bottomHeight) +
        toM(dimensions.topLength) *
          toM(dimensions.topWidth) *
          toM(dimensions.topHeight)
      );
    }
    case "box_cylinder_stack": {
      const baseVolume =
        toM(dimensions.baseLength) *
        toM(dimensions.baseWidth) *
        toM(dimensions.baseHeight);
      const radius = toM(dimensions.radius);
      const cylinderHeight = toM(dimensions.cylinderHeight);
      return baseVolume + Math.PI * radius ** 2 * cylinderHeight;
    }
    case "box_trapezoid_sump": {
      const boxVolume =
        toM(dimensions.boxLength) *
        toM(dimensions.boxWidth) *
        toM(dimensions.boxHeight);
      const sumpTopWidth = toM(dimensions.sumpTopWidth);
      const sumpBottomWidth = toM(dimensions.sumpBottomWidth);
      const sumpDepth = toM(dimensions.sumpDepth);
      const sumpHeight = toM(dimensions.sumpHeight);
      return boxVolume + ((sumpTopWidth + sumpBottomWidth) / 2) * sumpHeight * sumpDepth;
    }
    default: {
      const exhaustive: never = shape;
      throw new Error(`Unsupported shape: ${exhaustive}`);
    }
  }
}
