import { lengthToMeters } from "./units";
import type {
  CalculatorProject,
  ComponentPlacement,
  ShapeComponent,
} from "./types";

export interface ComponentAssemblySize {
  width: number;
  depth: number;
  height: number;
  topRatio?: number;
  bottomRatio?: number;
}

export interface ComponentBounds {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
  minZ: number;
  maxZ: number;
}

export const DEFAULT_PLACEMENT: ComponentPlacement = {
  xM: 0,
  yM: 0,
  zM: 0,
  rotationYDeg: 0,
};

function finiteOrDefault(value: number | undefined, fallback: number) {
  return Number.isFinite(value) && value !== undefined ? value : fallback;
}

function positiveDimension(value: number | undefined) {
  return finiteOrDefault(value, 0.1) > 0 ? Number(value) : 0.1;
}

function dimensionMeters(component: ShapeComponent, key: string) {
  return lengthToMeters(positiveDimension(component.dimensions[key]), component.unit);
}

function optionalDimensionMeters(component: ShapeComponent, key: string) {
  const value = component.dimensions[key];

  return Number.isFinite(value) && value !== undefined && value > 0
    ? lengthToMeters(value, component.unit)
    : undefined;
}

export function normalizePlacement(placement?: Partial<ComponentPlacement>): ComponentPlacement {
  return {
    xM: finiteOrDefault(placement?.xM, DEFAULT_PLACEMENT.xM),
    yM: finiteOrDefault(placement?.yM, DEFAULT_PLACEMENT.yM),
    zM: finiteOrDefault(placement?.zM, DEFAULT_PLACEMENT.zM),
    rotationYDeg: finiteOrDefault(
      placement?.rotationYDeg,
      DEFAULT_PLACEMENT.rotationYDeg,
    ),
  };
}

export function getComponentAssemblySizeM(component: ShapeComponent): ComponentAssemblySize {
  switch (component.shape) {
    case "box":
      return {
        width: dimensionMeters(component, "length"),
        depth: dimensionMeters(component, "width"),
        height: dimensionMeters(component, "height"),
      };
    case "cube": {
      const side = dimensionMeters(component, "side");
      return { width: side, depth: side, height: side };
    }
    case "cylinder":
    case "cone": {
      const radius = dimensionMeters(component, "radius");
      return {
        width: radius * 2,
        depth: radius * 2,
        height: dimensionMeters(component, "height"),
      };
    }
    case "tube": {
      const outerRadius = dimensionMeters(component, "outerRadius");
      return {
        width: outerRadius * 2,
        depth: outerRadius * 2,
        height: dimensionMeters(component, "height"),
      };
    }
    case "frustum": {
      const topRadius = dimensionMeters(component, "radiusTop");
      const bottomRadius = dimensionMeters(component, "radiusBottom");
      const maxRadius = Math.max(topRadius, bottomRadius, 0.01);

      return {
        width: maxRadius * 2,
        depth: maxRadius * 2,
        height: dimensionMeters(component, "height"),
        topRatio: Math.max(0.18, topRadius / maxRadius),
        bottomRatio: Math.max(0.18, bottomRadius / maxRadius),
      };
    }
    case "sphere": {
      const radius = dimensionMeters(component, "radius");
      return { width: radius * 2, depth: radius * 2, height: radius * 2 };
    }
    case "hemisphere": {
      const radius = dimensionMeters(component, "radius");
      return { width: radius * 2, depth: radius * 2, height: radius };
    }
    case "half_cylinder": {
      const radius = dimensionMeters(component, "radius");
      return {
        width: radius * 2,
        depth: dimensionMeters(component, "length"),
        height: radius,
      };
    }
    case "triangular_prism":
      return {
        width: dimensionMeters(component, "base"),
        depth: dimensionMeters(component, "length"),
        height: dimensionMeters(component, "triangleHeight"),
      };
    case "trapezoidal_prism": {
      const topWidth = dimensionMeters(component, "topWidth");
      const bottomWidth = dimensionMeters(component, "bottomWidth");
      const maxWidth = Math.max(topWidth, bottomWidth, 0.01);

      return {
        width: maxWidth,
        depth: dimensionMeters(component, "length"),
        height: dimensionMeters(component, "height"),
        topRatio: Math.max(0.18, topWidth / maxWidth),
        bottomRatio: Math.max(0.18, bottomWidth / maxWidth),
      };
    }
    case "rectangle_semicircle": {
      const width = dimensionMeters(component, "width");
      const radius = dimensionMeters(component, "radius");
      return {
        width: dimensionMeters(component, "rectLength") + radius,
        depth: Math.max(width, radius * 2),
        height: dimensionMeters(component, "height"),
      };
    }
    case "rectangle_trapezoid": {
      const rectWidth = dimensionMeters(component, "rectWidth");
      const topWidth = dimensionMeters(component, "trapTopWidth");
      const bottomWidth = dimensionMeters(component, "trapBottomWidth");

      return {
        width: dimensionMeters(component, "rectLength") + dimensionMeters(component, "trapLength"),
        depth: Math.max(rectWidth, topWidth, bottomWidth),
        height: dimensionMeters(component, "height"),
      };
    }
    case "l_shape":
      return {
        width: Math.max(
          dimensionMeters(component, "mainLength"),
          dimensionMeters(component, "legWidth"),
        ),
        depth: dimensionMeters(component, "mainWidth") + dimensionMeters(component, "legLength"),
        height: dimensionMeters(component, "height"),
      };
    case "t_shape":
      return {
        width: Math.max(
          dimensionMeters(component, "stemWidth"),
          dimensionMeters(component, "crossLength"),
        ),
        depth: dimensionMeters(component, "stemLength") + dimensionMeters(component, "crossWidth"),
        height: dimensionMeters(component, "height"),
      };
    case "stepped_boxes":
      return {
        width: Math.max(
          dimensionMeters(component, "lowerLength"),
          dimensionMeters(component, "upperLength"),
        ),
        depth: Math.max(
          dimensionMeters(component, "lowerWidth"),
          dimensionMeters(component, "upperWidth"),
        ),
        height: dimensionMeters(component, "lowerHeight") + dimensionMeters(component, "upperHeight"),
      };
    case "stacked_boxes":
      return {
        width: Math.max(
          dimensionMeters(component, "bottomLength"),
          dimensionMeters(component, "topLength"),
        ),
        depth: Math.max(
          dimensionMeters(component, "bottomWidth"),
          dimensionMeters(component, "topWidth"),
        ),
        height: dimensionMeters(component, "bottomHeight") + dimensionMeters(component, "topHeight"),
      };
    case "box_cylinder_stack": {
      const diameter = dimensionMeters(component, "radius") * 2;

      return {
        width: Math.max(dimensionMeters(component, "baseLength"), diameter),
        depth: Math.max(dimensionMeters(component, "baseWidth"), diameter),
        height:
          dimensionMeters(component, "baseHeight") +
          dimensionMeters(component, "cylinderHeight"),
      };
    }
    case "box_trapezoid_sump":
      return {
        width: Math.max(
          dimensionMeters(component, "boxLength"),
          dimensionMeters(component, "sumpDepth"),
        ),
        depth: Math.max(
          dimensionMeters(component, "boxWidth"),
          dimensionMeters(component, "sumpTopWidth"),
          dimensionMeters(component, "sumpBottomWidth"),
        ),
        height: dimensionMeters(component, "boxHeight") + dimensionMeters(component, "sumpHeight"),
      };
    default:
      return {
        width: optionalDimensionMeters(component, "length") ?? 1,
        depth:
          optionalDimensionMeters(component, "width") ??
          optionalDimensionMeters(component, "base") ??
          optionalDimensionMeters(component, "bottomWidth") ??
          0.7,
        height:
          optionalDimensionMeters(component, "height") ??
          optionalDimensionMeters(component, "triangleHeight") ??
          0.6,
      };
  }
}

export function getComponentBounds(component: ShapeComponent): ComponentBounds {
  const size = getComponentAssemblySizeM(component);
  const placement = normalizePlacement(component.placement);
  const radians = (placement.rotationYDeg * Math.PI) / 180;
  const cos = Math.abs(Math.cos(radians));
  const sin = Math.abs(Math.sin(radians));
  const width = size.width * cos + size.depth * sin;
  const depth = size.width * sin + size.depth * cos;

  return {
    minX: placement.xM - width / 2,
    maxX: placement.xM + width / 2,
    minY: placement.yM - size.height / 2,
    maxY: placement.yM + size.height / 2,
    minZ: placement.zM - depth / 2,
    maxZ: placement.zM + depth / 2,
  };
}

export function boundsIntersect(first: ComponentBounds, second: ComponentBounds) {
  return (
    first.minX < second.maxX &&
    first.maxX > second.minX &&
    first.minY < second.maxY &&
    first.maxY > second.minY &&
    first.minZ < second.maxZ &&
    first.maxZ > second.minZ
  );
}

export function normalizeProjectAssembly(project: CalculatorProject): CalculatorProject {
  return {
    ...project,
    components: project.components.map((component) => ({
      ...component,
      placement: normalizePlacement(component.placement),
    })),
  };
}
