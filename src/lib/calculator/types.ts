export type SceneType =
  | "general"
  | "cubic_feet"
  | "cubic_yards"
  | "shipping"
  | "concrete"
  | "room"
  | "soil"
  | "tank";

export type ShapeType =
  | "box"
  | "cube"
  | "cylinder"
  | "tube"
  | "cone"
  | "frustum"
  | "sphere"
  | "hemisphere"
  | "half_cylinder"
  | "triangular_prism"
  | "trapezoidal_prism"
  | "rectangle_semicircle"
  | "rectangle_trapezoid"
  | "l_shape"
  | "t_shape"
  | "stepped_boxes"
  | "stacked_boxes"
  | "box_cylinder_stack"
  | "box_trapezoid_sump";

export type OperationType = "add" | "subtract";

export type LengthUnit = "mm" | "cm" | "m" | "in" | "ft" | "yd";

export type VolumeUnit =
  | "m3"
  | "cm3"
  | "mm3"
  | "ft3"
  | "in3"
  | "yd3"
  | "l"
  | "ml"
  | "gal_us"
  | "gal_uk";

export type MaterialType =
  | "none"
  | "water"
  | "concrete"
  | "soil"
  | "sand"
  | "gravel"
  | "steel"
  | "wood"
  | "custom";

export type CurrencyCode =
  | "USD"
  | "EUR"
  | "GBP"
  | "JPY"
  | "CNY"
  | "AUD"
  | "CAD";

export interface ShapeComponent {
  id: string;
  name: string;
  shape: ShapeType;
  operation: OperationType;
  dimensions: Record<string, number>;
  unit: LengthUnit;
  quantity: number;
  enabled: boolean;
  placement?: ComponentPlacement;
}

export interface ComponentPlacement {
  xM: number;
  yM: number;
  zM: number;
  rotationYDeg: number;
}

export interface CalculatorProject {
  scene: SceneType;
  projectName: string;
  components: ShapeComponent[];
  defaultInputUnit: LengthUnit;
  outputUnits: VolumeUnit[];
  wasteFactorPercent: number;
  material: MaterialType;
  customDensityKgPerM3?: number;
  cost?: {
    enabled: boolean;
    costPerVolume: number;
    volumeUnit: VolumeUnit;
    currency: CurrencyCode;
  };
  shipping?: {
    actualWeightKg?: number;
    volumetricDivisor: number;
  };
}

export interface ComponentCalculationResult {
  componentId: string;
  name: string;
  valid: boolean;
  enabled: boolean;
  errors: string[];
  baseVolumeM3: number;
  quantity: number;
  totalVolumeM3: number;
  signedVolumeM3: number;
  formula: string;
}

export interface ProjectCalculationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
  componentResults: ComponentCalculationResult[];
  netVolumeM3: number;
  finalVolumeM3: number;
  wasteVolumeM3: number;
  convertedVolumes: Partial<Record<VolumeUnit, number>>;
  weight?: {
    densityKgPerM3: number;
    kg: number;
    metricTons: number;
    lb: number;
  };
  cost?: {
    amount: number;
    currency: CurrencyCode;
  };
  shipping?: {
    totalVolumetricWeightKg?: number;
    actualWeightKg?: number;
    chargeableWeightKg?: number;
    totalQuantity: number;
  };
  formula: string;
}

export interface ShapeDefinition {
  id: ShapeType;
  label: string;
  shortLabel: string;
  dimensions: Array<{
    key: string;
    label: string;
    placeholder: string;
  }>;
}

export interface MaterialDefinition {
  id: MaterialType;
  label: string;
  densityKgPerM3: number | null;
}

export interface SceneDefinition {
  id: SceneType;
  label: string;
  route: string;
  title: string;
  description: string;
  useCase: string;
}
