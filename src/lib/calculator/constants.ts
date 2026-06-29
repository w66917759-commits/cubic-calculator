import type {
  CurrencyCode,
  LengthUnit,
  MaterialDefinition,
  SceneDefinition,
  ShapeDefinition,
  VolumeUnit,
} from "./types";

export const LENGTH_UNITS: Array<{ id: LengthUnit; label: string }> = [
  { id: "mm", label: "millimeter" },
  { id: "cm", label: "centimeter" },
  { id: "m", label: "meter" },
  { id: "in", label: "inch" },
  { id: "ft", label: "foot" },
  { id: "yd", label: "yard" },
];

export const VOLUME_UNITS: Array<{ id: VolumeUnit; label: string }> = [
  { id: "m3", label: "cubic meter" },
  { id: "cm3", label: "cubic centimeter" },
  { id: "mm3", label: "cubic millimeter" },
  { id: "ft3", label: "cubic foot" },
  { id: "in3", label: "cubic inch" },
  { id: "yd3", label: "cubic yard" },
  { id: "l", label: "liter" },
  { id: "ml", label: "milliliter" },
  { id: "gal_us", label: "US gallon" },
  { id: "gal_uk", label: "UK gallon" },
];

export const CURRENCIES: CurrencyCode[] = [
  "USD",
  "EUR",
  "GBP",
  "JPY",
  "CNY",
  "AUD",
  "CAD",
];

export const MATERIALS: MaterialDefinition[] = [
  { id: "none", label: "None", densityKgPerM3: null },
  { id: "water", label: "Water", densityKgPerM3: 1000 },
  { id: "concrete", label: "Concrete", densityKgPerM3: 2400 },
  { id: "soil", label: "Soil", densityKgPerM3: 1300 },
  { id: "sand", label: "Sand", densityKgPerM3: 1600 },
  { id: "gravel", label: "Gravel", densityKgPerM3: 1700 },
  { id: "steel", label: "Steel", densityKgPerM3: 7850 },
  { id: "wood", label: "Wood", densityKgPerM3: 700 },
  { id: "custom", label: "Custom", densityKgPerM3: null },
];

export const SHAPES: ShapeDefinition[] = [
  {
    id: "box",
    label: "Rectangular Prism / Box",
    shortLabel: "Box",
    dimensions: [
      { key: "length", label: "Length", placeholder: "2" },
      { key: "width", label: "Width", placeholder: "3" },
      { key: "height", label: "Height", placeholder: "4" },
    ],
  },
  {
    id: "cube",
    label: "Cube",
    shortLabel: "Cube",
    dimensions: [{ key: "side", label: "Side", placeholder: "1" }],
  },
  {
    id: "cylinder",
    label: "Cylinder",
    shortLabel: "Cylinder",
    dimensions: [
      { key: "radius", label: "Radius", placeholder: "0.5" },
      { key: "height", label: "Height", placeholder: "1" },
    ],
  },
  {
    id: "tube",
    label: "Hollow Cylinder / Tube",
    shortLabel: "Tube",
    dimensions: [
      { key: "outerRadius", label: "Outer radius", placeholder: "0.6" },
      { key: "innerRadius", label: "Inner radius", placeholder: "0.4" },
      { key: "height", label: "Height", placeholder: "1" },
    ],
  },
  {
    id: "cone",
    label: "Cone",
    shortLabel: "Cone",
    dimensions: [
      { key: "radius", label: "Radius", placeholder: "0.5" },
      { key: "height", label: "Height", placeholder: "1" },
    ],
  },
  {
    id: "frustum",
    label: "Conical Frustum",
    shortLabel: "Frustum",
    dimensions: [
      { key: "radiusTop", label: "Top radius", placeholder: "0.35" },
      { key: "radiusBottom", label: "Bottom radius", placeholder: "0.6" },
      { key: "height", label: "Height", placeholder: "1" },
    ],
  },
  {
    id: "sphere",
    label: "Sphere",
    shortLabel: "Sphere",
    dimensions: [{ key: "radius", label: "Radius", placeholder: "0.5" }],
  },
  {
    id: "hemisphere",
    label: "Hemisphere",
    shortLabel: "Hemisphere",
    dimensions: [{ key: "radius", label: "Radius", placeholder: "0.5" }],
  },
  {
    id: "half_cylinder",
    label: "Semicircle Prism / Half Cylinder",
    shortLabel: "Half cylinder",
    dimensions: [
      { key: "radius", label: "Radius", placeholder: "0.5" },
      { key: "length", label: "Length", placeholder: "2" },
    ],
  },
  {
    id: "triangular_prism",
    label: "Triangular Prism",
    shortLabel: "Triangular prism",
    dimensions: [
      { key: "base", label: "Triangle base", placeholder: "1" },
      { key: "triangleHeight", label: "Triangle height", placeholder: "0.5" },
      { key: "length", label: "Length", placeholder: "2" },
    ],
  },
  {
    id: "trapezoidal_prism",
    label: "Trapezoidal Prism",
    shortLabel: "Trapezoidal prism",
    dimensions: [
      { key: "topWidth", label: "Top width", placeholder: "0.7" },
      { key: "bottomWidth", label: "Bottom width", placeholder: "1" },
      { key: "height", label: "Height", placeholder: "0.5" },
      { key: "length", label: "Length", placeholder: "3" },
    ],
  },
  {
    id: "rectangle_semicircle",
    label: "Rectangle + Semicircle",
    shortLabel: "Rect + semicircle",
    dimensions: [
      { key: "rectLength", label: "Rectangle length", placeholder: "2" },
      { key: "width", label: "Rectangle width", placeholder: "1" },
      { key: "radius", label: "Semicircle radius", placeholder: "0.5" },
      { key: "height", label: "Height", placeholder: "0.5" },
    ],
  },
  {
    id: "rectangle_trapezoid",
    label: "Rectangle + Trapezoid",
    shortLabel: "Rect + trapezoid",
    dimensions: [
      { key: "rectLength", label: "Rectangle length", placeholder: "2" },
      { key: "rectWidth", label: "Rectangle width", placeholder: "1" },
      { key: "trapTopWidth", label: "Trapezoid top width", placeholder: "0.7" },
      { key: "trapBottomWidth", label: "Trapezoid bottom width", placeholder: "1" },
      { key: "trapLength", label: "Trapezoid length", placeholder: "1" },
      { key: "height", label: "Height", placeholder: "0.5" },
    ],
  },
  {
    id: "l_shape",
    label: "L-Shaped Rectangles",
    shortLabel: "L shape",
    dimensions: [
      { key: "mainLength", label: "Main length", placeholder: "4" },
      { key: "mainWidth", label: "Main width", placeholder: "2" },
      { key: "legLength", label: "Return length", placeholder: "2" },
      { key: "legWidth", label: "Return width", placeholder: "1" },
      { key: "height", label: "Height", placeholder: "2.6" },
    ],
  },
  {
    id: "t_shape",
    label: "T-Shaped Rectangles",
    shortLabel: "T shape",
    dimensions: [
      { key: "stemLength", label: "Stem length", placeholder: "3" },
      { key: "stemWidth", label: "Stem width", placeholder: "1" },
      { key: "crossLength", label: "Cross length", placeholder: "4" },
      { key: "crossWidth", label: "Cross width", placeholder: "1" },
      { key: "height", label: "Height", placeholder: "2.6" },
    ],
  },
  {
    id: "stepped_boxes",
    label: "Stepped Rectangular Blocks",
    shortLabel: "Stepped blocks",
    dimensions: [
      { key: "lowerLength", label: "Lower length", placeholder: "2" },
      { key: "lowerWidth", label: "Lower width", placeholder: "1" },
      { key: "lowerHeight", label: "Lower height", placeholder: "0.4" },
      { key: "upperLength", label: "Upper length", placeholder: "1.2" },
      { key: "upperWidth", label: "Upper width", placeholder: "0.8" },
      { key: "upperHeight", label: "Upper height", placeholder: "0.3" },
    ],
  },
  {
    id: "stacked_boxes",
    label: "Stacked Rectangular Boxes",
    shortLabel: "Stacked boxes",
    dimensions: [
      { key: "bottomLength", label: "Bottom length", placeholder: "60" },
      { key: "bottomWidth", label: "Bottom width", placeholder: "40" },
      { key: "bottomHeight", label: "Bottom height", placeholder: "30" },
      { key: "topLength", label: "Top length", placeholder: "45" },
      { key: "topWidth", label: "Top width", placeholder: "35" },
      { key: "topHeight", label: "Top height", placeholder: "25" },
    ],
  },
  {
    id: "box_cylinder_stack",
    label: "Box + Cylinder",
    shortLabel: "Box + cylinder",
    dimensions: [
      { key: "baseLength", label: "Base length", placeholder: "2.4" },
      { key: "baseWidth", label: "Base width", placeholder: "0.6" },
      { key: "baseHeight", label: "Base height", placeholder: "0.35" },
      { key: "radius", label: "Cylinder radius", placeholder: "0.22" },
      { key: "cylinderHeight", label: "Cylinder height", placeholder: "2.2" },
    ],
  },
  {
    id: "box_trapezoid_sump",
    label: "Box + Trapezoid Sump",
    shortLabel: "Box + sump",
    dimensions: [
      { key: "boxLength", label: "Box length", placeholder: "1.4" },
      { key: "boxWidth", label: "Box width", placeholder: "0.8" },
      { key: "boxHeight", label: "Box height", placeholder: "0.7" },
      { key: "sumpTopWidth", label: "Sump top width", placeholder: "0.8" },
      { key: "sumpBottomWidth", label: "Sump bottom width", placeholder: "0.45" },
      { key: "sumpDepth", label: "Sump depth", placeholder: "0.8" },
      { key: "sumpHeight", label: "Sump height", placeholder: "0.35" },
    ],
  },
];

export const SCENES: SceneDefinition[] = [
  {
    id: "general",
    label: "3D Shapes",
    route: "/cubic-calculator",
    title: "Cubic Calculator",
    description: "Build a cubic measurement from boxes, cylinders, cones, spheres, and prisms.",
    useCase: "Mixed 3D volume projects",
  },
  {
    id: "cubic_feet",
    label: "Cubic Feet",
    route: "/cubic-feet-calculator",
    title: "Cubic Feet Calculator",
    description: "Calculate ft3 from length, width, height, quantity, and common 3D shapes.",
    useCase: "ft³ estimates, rooms, storage",
  },
  {
    id: "cubic_yards",
    label: "Cubic Yard",
    route: "/cubic-yard-calculator",
    title: "Cubic Yard Calculator",
    description: "Calculate yd3 from length, width, depth, and material dimensions.",
    useCase: "yd³ estimates, material ordering",
  },
  {
    id: "shipping",
    label: "CBM Freight",
    route: "/cbm-calculator",
    title: "CBM Calculator",
    description: "Calculate cubic meter freight volume from carton dimensions and quantity.",
    useCase: "Cargo, cartons, freight quotes",
  },
  {
    id: "concrete",
    label: "Concrete",
    route: "/concrete-volume-calculator",
    title: "Concrete Volume Calculator",
    description: "Calculate concrete quantity from dimensions, voids, and waste.",
    useCase: "Slabs, footings, columns, holes",
  },
  {
    id: "room",
    label: "Room Air",
    route: "/room-volume-calculator",
    title: "Room Volume Calculator",
    description: "Calculate room volume from length, width, height, and layout dimensions.",
    useCase: "Rooms, storage, HVAC estimates",
  },
  {
    id: "tank",
    label: "Tank Capacity",
    route: "/tank-volume-calculator",
    title: "Tank Volume Calculator",
    description: "Calculate full tank volume from vessel dimensions and shape.",
    useCase: "Water tanks, bins, vessels",
  },
  {
    id: "soil",
    label: "Soil / Mulch",
    route: "/soil-volume-calculator",
    title: "Soil Calculator",
    description: "Calculate soil quantity from bed, planter, trench, or mound dimensions.",
    useCase: "Raised beds, trenches, planters",
  },
];

export const DEFAULT_VOLUME_UNITS: VolumeUnit[] = ["m3", "ft3", "l"];
