import { normalizePlacement, normalizeProjectAssembly } from "./assembly";
import type {
  CalculatorProject,
  ComponentPlacement,
  LengthUnit,
  OperationType,
  SceneType,
  ShapeComponent,
  ShapeType,
} from "./types";

export interface ComponentTemplate {
  id: string;
  name: string;
  category: string;
  components: ShapeComponent[];
}

let nextComponentId = 100;

export function makeComponent(
  name: string,
  shape: ShapeType,
  dimensions: Record<string, number>,
  unit: LengthUnit,
  operation: OperationType = "add",
  quantity = 1,
  placement?: Partial<ComponentPlacement>,
): ShapeComponent {
  nextComponentId += 1;
  return {
    id: `component-${nextComponentId}`,
    name,
    shape,
    operation,
    dimensions,
    unit,
    quantity,
    enabled: true,
    placement: normalizePlacement(placement),
  };
}

function fixedComponent(
  id: string,
  name: string,
  shape: ShapeType,
  dimensions: Record<string, number>,
  unit: LengthUnit,
  placement?: Partial<ComponentPlacement>,
): ShapeComponent {
  return {
    id,
    name,
    shape,
    operation: "add",
    dimensions,
    unit,
    quantity: 1,
    enabled: true,
    placement: normalizePlacement(placement),
  };
}

function template(
  id: string,
  name: string,
  category: string,
  components: ShapeComponent[],
): ComponentTemplate {
  return {
    id,
    name,
    category,
    components,
  };
}

export const presets: Record<SceneType, CalculatorProject> = {
  general: {
    scene: "general",
    projectName: "General volume project",
    defaultInputUnit: "m",
    outputUnits: ["m3", "ft3", "l"],
    wasteFactorPercent: 0,
    material: "none",
    components: [
      fixedComponent("component-1", "Box", "box", { length: 1, width: 1, height: 1 }, "m"),
    ],
  },
  cubic_feet: {
    scene: "cubic_feet",
    projectName: "Cubic feet project",
    defaultInputUnit: "ft",
    outputUnits: ["ft3", "yd3", "m3"],
    wasteFactorPercent: 0,
    material: "none",
    components: [
      fixedComponent("component-1", "Box in feet", "box", { length: 8, width: 6, height: 4 }, "ft"),
    ],
  },
  cubic_yards: {
    scene: "cubic_yards",
    projectName: "Cubic yard project",
    defaultInputUnit: "ft",
    outputUnits: ["yd3", "ft3", "m3"],
    wasteFactorPercent: 0,
    material: "none",
    components: [
      fixedComponent("component-1", "Bulk material area", "box", { length: 10, width: 6, height: 0.5 }, "ft"),
    ],
  },
  shipping: {
    scene: "shipping",
    projectName: "Shipping volume project",
    defaultInputUnit: "cm",
    outputUnits: ["m3", "ft3"],
    wasteFactorPercent: 0,
    material: "none",
    shipping: {
      volumetricDivisor: 5000,
    },
    components: [
      fixedComponent("component-1", "Carton 1", "box", { length: 40, width: 30, height: 20 }, "cm"),
    ],
  },
  concrete: {
    scene: "concrete",
    projectName: "Concrete volume project",
    defaultInputUnit: "m",
    outputUnits: ["m3", "yd3"],
    wasteFactorPercent: 8,
    material: "concrete",
    components: [
      fixedComponent("component-1", "Main slab", "box", { length: 5, width: 4, height: 0.12 }, "m"),
    ],
  },
  room: {
    scene: "room",
    projectName: "Room volume project",
    defaultInputUnit: "m",
    outputUnits: ["m3", "ft3"],
    wasteFactorPercent: 0,
    material: "none",
    components: [
      fixedComponent("component-1", "Main room", "box", { length: 4, width: 3.5, height: 2.6 }, "m"),
    ],
  },
  soil: {
    scene: "soil",
    projectName: "Soil and mulch project",
    defaultInputUnit: "m",
    outputUnits: ["m3", "l", "yd3"],
    wasteFactorPercent: 10,
    material: "soil",
    components: [
      fixedComponent("component-1", "Raised bed", "box", { length: 2.4, width: 1.2, height: 0.35 }, "m"),
    ],
  },
  tank: {
    scene: "tank",
    projectName: "Tank capacity project",
    defaultInputUnit: "m",
    outputUnits: ["l", "gal_us", "gal_uk", "m3"],
    wasteFactorPercent: 0,
    material: "water",
    components: [
      fixedComponent("component-1", "Cylinder tank", "cylinder", { radius: 0.5, height: 1.2 }, "m"),
    ],
  },
};

export const templateComponents: Record<SceneType, ComponentTemplate[]> = {
  general: [
    template("box", "Rectangular block", "Single shapes", [
      makeComponent("Rectangular block", "box", { length: 1.8, width: 0.9, height: 0.6 }, "m"),
    ]),
    template("long-box", "Long rectangular beam", "Single shapes", [
      makeComponent("Long rectangular beam", "box", { length: 3, width: 0.35, height: 0.35 }, "m"),
    ]),
    template("cube", "Cube", "Single shapes", [
      makeComponent("Cube", "cube", { side: 1 }, "m"),
    ]),
    template("cylinder", "Cylinder", "Single shapes", [
      makeComponent("Cylinder", "cylinder", { radius: 0.5, height: 1 }, "m"),
    ]),
    template("half-cylinder", "Semicircle / half cylinder", "Single shapes", [
      makeComponent("Half cylinder", "half_cylinder", { radius: 0.5, length: 1.6 }, "m"),
    ]),
    template("hemisphere", "Hemisphere", "Single shapes", [
      makeComponent("Hemisphere", "hemisphere", { radius: 0.6 }, "m"),
    ]),
    template("trapezoid", "Trapezoidal prism", "Single shapes", [
      makeComponent("Trapezoidal prism", "trapezoidal_prism", { topWidth: 0.7, bottomWidth: 1.2, height: 0.55, length: 1.8 }, "m"),
    ]),
    template("triangle", "Triangular prism", "Single shapes", [
      makeComponent("Triangular prism", "triangular_prism", { base: 1.2, triangleHeight: 0.6, length: 1.8 }, "m"),
    ]),
    template("rectangle-semicircle", "Rectangle + semicircle end", "Common assemblies", [
      makeComponent("Rectangle + semicircle end", "rectangle_semicircle", { rectLength: 2, width: 1, radius: 0.5, height: 0.45 }, "m"),
    ]),
    template("rectangle-trapezoid", "Rectangle + trapezoid section", "Common assemblies", [
      makeComponent("Rectangle + trapezoid section", "rectangle_trapezoid", { rectLength: 1.6, rectWidth: 1, trapTopWidth: 0.65, trapBottomWidth: 1, trapLength: 1, height: 0.5 }, "m"),
    ]),
    template("l-shape", "L-shaped rectangles", "Common assemblies", [
      makeComponent("L-shaped rectangles", "l_shape", { mainLength: 2.6, mainWidth: 0.8, legLength: 1.8, legWidth: 0.8, height: 0.45 }, "m"),
    ]),
    template("t-shape", "T-shaped rectangles", "Common assemblies", [
      makeComponent("T-shaped rectangles", "t_shape", { stemLength: 2.2, stemWidth: 0.8, crossLength: 2.4, crossWidth: 0.8, height: 0.45 }, "m"),
    ]),
    template("stepped-blocks", "Stepped rectangular blocks", "Common assemblies", [
      makeComponent("Stepped rectangular blocks", "stepped_boxes", { lowerLength: 1.8, lowerWidth: 1, lowerHeight: 0.35, upperLength: 1.1, upperWidth: 0.7, upperHeight: 0.35 }, "m"),
    ]),
  ],
  cubic_feet: [
    template("box-feet", "Length x width x height", "Cubic feet", [
      makeComponent("Box in feet", "box", { length: 8, width: 6, height: 4 }, "ft"),
    ]),
    template("room-feet", "Room in feet", "Cubic feet", [
      makeComponent("Room in feet", "box", { length: 12, width: 10, height: 8 }, "ft"),
    ]),
    template("cube-feet", "Cube in feet", "Single shapes", [
      makeComponent("Cube in feet", "cube", { side: 3 }, "ft"),
    ]),
    template("cylinder-feet", "Cylinder in feet", "Single shapes", [
      makeComponent("Cylinder in feet", "cylinder", { radius: 2, height: 6 }, "ft"),
    ]),
    template("l-shape-feet", "L-shaped area in feet", "Common assemblies", [
      makeComponent("L-shaped area in feet", "l_shape", { mainLength: 12, mainWidth: 8, legLength: 6, legWidth: 4, height: 1 }, "ft"),
    ]),
  ],
  cubic_yards: [
    template("box-to-yards", "Feet to cubic yards", "Cubic yards", [
      makeComponent("Bulk material area", "box", { length: 10, width: 6, height: 0.5 }, "ft"),
    ]),
    template("yard-dimensions", "Yard dimensions", "Cubic yards", [
      makeComponent("Yard dimensions", "box", { length: 3, width: 2, height: 1 }, "yd"),
    ]),
    template("soil-bed-yards", "Soil bed", "Material estimates", [
      makeComponent("Soil bed", "box", { length: 12, width: 4, height: 0.75 }, "ft"),
    ]),
    template("gravel-trench-yards", "Gravel trench", "Material estimates", [
      makeComponent("Gravel trench", "trapezoidal_prism", { topWidth: 2, bottomWidth: 1.5, height: 1, length: 20 }, "ft"),
    ]),
    template("round-hole-yards", "Round hole", "Material estimates", [
      makeComponent("Round hole", "cylinder", { radius: 1.5, height: 3 }, "ft"),
    ]),
  ],
  shipping: [
    template("carton", "Carton", "Cartons", [
      makeComponent("Carton", "box", { length: 40, width: 30, height: 20 }, "cm"),
    ]),
    template("large-carton", "Large carton", "Cartons", [
      makeComponent("Large carton", "box", { length: 60, width: 40, height: 35 }, "cm"),
    ]),
    template("long-crate", "Long rectangular crate", "Cartons", [
      makeComponent("Long crate", "box", { length: 120, width: 35, height: 35 }, "cm"),
    ]),
    template("mixed-carton-stack", "Mixed carton stack", "Assemblies", [
      makeComponent("Mixed carton stack", "stacked_boxes", { bottomLength: 60, bottomWidth: 40, bottomHeight: 30, topLength: 45, topWidth: 35, topHeight: 25 }, "cm"),
    ]),
  ],
  concrete: [
    template("slab", "Rectangular slab", "Concrete shapes", [
      makeComponent("Slab", "box", { length: 5, width: 4, height: 0.12 }, "m"),
    ]),
    template("footing", "Long rectangular footing", "Concrete shapes", [
      makeComponent("Footing", "box", { length: 3, width: 0.5, height: 0.4 }, "m"),
    ]),
    template("column", "Round column", "Concrete shapes", [
      makeComponent("Column", "cylinder", { radius: 0.2, height: 2.5 }, "m"),
    ]),
    template("round-hole", "Round hole", "Concrete shapes", [
      makeComponent("Round hole", "cylinder", { radius: 0.05, height: 0.12 }, "m", "subtract"),
    ]),
    template("trench", "Trapezoid trench", "Concrete shapes", [
      makeComponent("Trench", "trapezoidal_prism", { topWidth: 0.5, bottomWidth: 0.35, height: 0.45, length: 8 }, "m"),
    ]),
    template("ramp", "Triangular ramp", "Concrete shapes", [
      makeComponent("Triangular ramp", "triangular_prism", { base: 1.5, triangleHeight: 0.4, length: 3 }, "m"),
    ]),
    template("semicircle-pad", "Rectangle + semicircle pad", "Assemblies", [
      makeComponent("Rectangle + semicircle pad", "rectangle_semicircle", { rectLength: 3, width: 1.5, radius: 0.75, height: 0.12 }, "m"),
    ]),
    template("footing-column", "Footing + column", "Assemblies", [
      makeComponent("Footing + column", "box_cylinder_stack", { baseLength: 2.4, baseWidth: 0.6, baseHeight: 0.35, radius: 0.22, cylinderHeight: 2.2 }, "m"),
    ]),
  ],
  room: [
    template("rectangular-room", "Rectangular room", "Room shapes", [
      makeComponent("Rectangular room", "box", { length: 4, width: 3, height: 2.6 }, "m"),
    ]),
    template("long-room", "Long rectangular room", "Room shapes", [
      makeComponent("Long room", "box", { length: 7, width: 2.8, height: 2.6 }, "m"),
    ]),
    template("l-shaped-room", "L-shaped room", "Common layouts", [
      makeComponent("L-shaped room", "l_shape", { mainLength: 4.2, mainWidth: 3, legLength: 2, legWidth: 1.8, height: 2.6 }, "m"),
    ]),
    template("t-shaped-room", "T-shaped room", "Common layouts", [
      makeComponent("T-shaped room", "t_shape", { stemLength: 4.2, stemWidth: 2.4, crossLength: 4.6, crossWidth: 1.7, height: 2.6 }, "m"),
    ]),
    template("semicircle-alcove", "Rectangle + semicircle alcove", "Common layouts", [
      makeComponent("Rectangle + semicircle alcove", "rectangle_semicircle", { rectLength: 4, width: 3, radius: 1.5, height: 2.6 }, "m"),
    ]),
    template("trapezoid-bay", "Rectangle + trapezoid bay", "Common layouts", [
      makeComponent("Rectangle + trapezoid bay", "rectangle_trapezoid", { rectLength: 3.5, rectWidth: 3, trapTopWidth: 1.6, trapBottomWidth: 2.4, trapLength: 1.2, height: 2.6 }, "m"),
    ]),
    template("sloped-ceiling", "Sloped ceiling void", "Room shapes", [
      makeComponent("Sloped ceiling void", "triangular_prism", { base: 2, triangleHeight: 0.7, length: 3 }, "m", "subtract", 1, { yM: 0.95 }),
    ]),
  ],
  soil: [
    template("raised-bed", "Rectangular raised bed", "Beds and trenches", [
      makeComponent("Raised bed", "box", { length: 2.4, width: 1.2, height: 0.35 }, "m"),
    ]),
    template("round-planter", "Round planter", "Beds and trenches", [
      makeComponent("Round planter", "cylinder", { radius: 0.4, height: 0.45 }, "m"),
    ]),
    template("half-round-bed", "Rectangle + semicircle bed", "Beds and trenches", [
      makeComponent("Rectangle + semicircle bed", "rectangle_semicircle", { rectLength: 2.2, width: 1, radius: 0.5, height: 0.35 }, "m"),
    ]),
    template("trench", "Trapezoid trench", "Beds and trenches", [
      makeComponent("Trench", "trapezoidal_prism", { topWidth: 0.5, bottomWidth: 0.35, height: 0.4, length: 6 }, "m"),
    ]),
    template("soil-mound", "Cone soil mound", "Beds and trenches", [
      makeComponent("Soil mound", "cone", { radius: 1, height: 0.5 }, "m"),
    ]),
    template("stepped-bed", "Stepped rectangular bed", "Assemblies", [
      makeComponent("Stepped rectangular bed", "stepped_boxes", { lowerLength: 2.6, lowerWidth: 1, lowerHeight: 0.25, upperLength: 1.5, upperWidth: 0.8, upperHeight: 0.25 }, "m"),
    ]),
  ],
  tank: [
    template("rectangular-tank", "Rectangular tank", "Tank shapes", [
      makeComponent("Rectangular tank", "box", { length: 1.2, width: 0.8, height: 0.7 }, "m"),
    ]),
    template("vertical-cylinder", "Vertical cylinder tank", "Tank shapes", [
      makeComponent("Vertical cylinder tank", "cylinder", { radius: 0.5, height: 1.2 }, "m"),
    ]),
    template("half-cylinder-trough", "Half cylinder trough", "Tank shapes", [
      makeComponent("Half cylinder trough", "half_cylinder", { radius: 0.45, length: 1.5 }, "m"),
    ]),
    template("conical-tank", "Conical tank", "Tank shapes", [
      makeComponent("Conical tank", "cone", { radius: 0.6, height: 1 }, "m"),
    ]),
    template("frustum-tank", "Frustum tank", "Tank shapes", [
      makeComponent("Frustum tank", "frustum", { radiusTop: 0.45, radiusBottom: 0.65, height: 1 }, "m"),
    ]),
    template("spherical-tank", "Spherical tank", "Tank shapes", [
      makeComponent("Spherical tank", "sphere", { radius: 0.6 }, "m"),
    ]),
    template("rectangular-tank-trapezoid", "Rectangle + trapezoid sump", "Assemblies", [
      makeComponent("Rectangle + trapezoid sump", "box_trapezoid_sump", { boxLength: 1.4, boxWidth: 0.8, boxHeight: 0.7, sumpTopWidth: 0.8, sumpBottomWidth: 0.45, sumpDepth: 0.8, sumpHeight: 0.35 }, "m"),
    ]),
  ],
};

export function cloneProject(scene: SceneType): CalculatorProject {
  return normalizeProjectAssembly(structuredClone(presets[scene]));
}

export function cloneTemplate(component: ShapeComponent): ShapeComponent {
  nextComponentId += 1;
  return structuredClone({
    ...component,
    id: `component-${nextComponentId}`,
    placement: normalizePlacement(component.placement),
  });
}

export function cloneTemplateComponents(templateItem: ComponentTemplate): ShapeComponent[] {
  return templateItem.components.map(cloneTemplate);
}
