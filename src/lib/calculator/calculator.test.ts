import { describe, expect, it } from "vitest";
import { calculateProject } from "./calculateProject";
import { cloneTemplateComponents, templateComponents } from "./presets";
import { convertFromM3, convertToM3 } from "./units";
import type { CalculatorProject, SceneType } from "./types";

const baseProject: CalculatorProject = {
  scene: "general",
  projectName: "Test",
  defaultInputUnit: "m",
  outputUnits: ["m3", "ft3", "l"],
  wasteFactorPercent: 0,
  material: "none",
  components: [],
};

describe("calculator core", () => {
  it("calculates box volume", () => {
    const result = calculateProject({
      ...baseProject,
      components: [
        {
          id: "box",
          name: "Box",
          shape: "box",
          operation: "add",
          dimensions: { length: 2, width: 3, height: 4 },
          unit: "m",
          quantity: 1,
          enabled: true,
        },
      ],
    });

    expect(result.netVolumeM3).toBeCloseTo(24);
  });

  it("calculates semicircle prism volume", () => {
    const result = calculateProject({
      ...baseProject,
      components: [
        {
          id: "half-cylinder",
          name: "Half cylinder",
          shape: "half_cylinder",
          operation: "add",
          dimensions: { radius: 2, length: 3 },
          unit: "m",
          quantity: 1,
          enabled: true,
        },
      ],
    });

    expect(result.netVolumeM3).toBeCloseTo(6 * Math.PI);
  });

  it("applies quantity and unit conversion", () => {
    const result = calculateProject({
      ...baseProject,
      components: [
        {
          id: "box",
          name: "Box",
          shape: "box",
          operation: "add",
          dimensions: { length: 100, width: 100, height: 100 },
          unit: "cm",
          quantity: 10,
          enabled: true,
        },
      ],
    });

    expect(result.netVolumeM3).toBeCloseTo(10);
    expect(convertFromM3(1, "l")).toBe(1000);
    expect(convertFromM3(1, "ft3")).toBeCloseTo(35.3147, 4);
  });

  it("converts volume units through cubic meters", () => {
    const cubicFeetInOneCubicYard = convertFromM3(convertToM3(1, "yd3"), "ft3");
    const litersInOneUsGallon = convertFromM3(convertToM3(1, "gal_us"), "l");

    expect(cubicFeetInOneCubicYard).toBeCloseTo(27, 4);
    expect(litersInOneUsGallon).toBeCloseTo(3.78541, 4);
  });

  it("handles add and subtract components", () => {
    const result = calculateProject({
      ...baseProject,
      components: [
        {
          id: "add",
          name: "Base",
          shape: "box",
          operation: "add",
          dimensions: { length: 2, width: 2, height: 1 },
          unit: "m",
          quantity: 1,
          enabled: true,
        },
        {
          id: "subtract",
          name: "Void",
          shape: "cylinder",
          operation: "subtract",
          dimensions: { radius: 0.5, height: 1 },
          unit: "m",
          quantity: 1,
          enabled: true,
        },
      ],
    });

    expect(result.netVolumeM3).toBeCloseTo(3.214602, 6);
  });

  it("applies waste and material density", () => {
    const result = calculateProject({
      ...baseProject,
      wasteFactorPercent: 8,
      material: "concrete",
      components: [
        {
          id: "box",
          name: "Concrete",
          shape: "box",
          operation: "add",
          dimensions: { length: 2, width: 5, height: 1 },
          unit: "m",
          quantity: 1,
          enabled: true,
        },
      ],
    });

    expect(result.finalVolumeM3).toBeCloseTo(10.8);
    expect(result.weight?.kg).toBeCloseTo(25920);
  });

  it("calculates shipping volumetric weight", () => {
    const result = calculateProject({
      ...baseProject,
      scene: "shipping",
      outputUnits: ["m3", "ft3"],
      shipping: { volumetricDivisor: 5000 },
      components: [
        {
          id: "carton",
          name: "Carton",
          shape: "box",
          operation: "add",
          dimensions: { length: 40, width: 30, height: 20 },
          unit: "cm",
          quantity: 10,
          enabled: true,
        },
      ],
    });

    expect(result.netVolumeM3).toBeCloseTo(0.24);
    expect(result.convertedVolumes.ft3).toBeCloseTo(8.4755, 4);
    expect(result.shipping?.totalVolumetricWeightKg).toBeCloseTo(48);
  });

  it("validates tube dimensions", () => {
    const result = calculateProject({
      ...baseProject,
      components: [
        {
          id: "tube",
          name: "Tube",
          shape: "tube",
          operation: "add",
          dimensions: { outerRadius: 5, innerRadius: 6, height: 10 },
          unit: "cm",
          quantity: 1,
          enabled: true,
        },
      ],
    });

    expect(result.valid).toBe(false);
    expect(result.errors.join(" ")).toContain(
      "Inner radius must be smaller than outer radius.",
    );
  });

  it("calculates rectangle plus semicircle as one combined shape", () => {
    const result = calculateProject({
      ...baseProject,
      components: [
        {
          id: "combined",
          name: "Rectangle + semicircle",
          shape: "rectangle_semicircle",
          operation: "add",
          dimensions: { rectLength: 2, width: 1, radius: 0.75, height: 0.5 },
          unit: "m",
          quantity: 1,
          enabled: true,
        },
      ],
    });

    expect(result.netVolumeM3).toBeCloseTo(
      (2 * 1 + (Math.PI * 0.75 ** 2) / 2) * 0.5,
    );
  });

  it("calculates an L-shaped layout as one direct-input shape", () => {
    const result = calculateProject({
      ...baseProject,
      components: [
        {
          id: "l-shape",
          name: "L-shaped room",
          shape: "l_shape",
          operation: "add",
          dimensions: {
            mainLength: 4,
            mainWidth: 3,
            legLength: 2,
            legWidth: 1.5,
            height: 2.5,
          },
          unit: "m",
          quantity: 1,
          enabled: true,
        },
      ],
    });

    expect(result.netVolumeM3).toBeCloseTo((4 * 3 + 2 * 1.5) * 2.5);
  });

  it("uses combined template selections as single direct-input components", () => {
    const cases: Array<{ scene: SceneType; templateId: string }> = [
      { scene: "general", templateId: "rectangle-semicircle" },
      { scene: "general", templateId: "rectangle-trapezoid" },
      { scene: "general", templateId: "l-shape" },
      { scene: "general", templateId: "t-shape" },
      { scene: "general", templateId: "stepped-blocks" },
      { scene: "shipping", templateId: "mixed-carton-stack" },
      { scene: "concrete", templateId: "semicircle-pad" },
      { scene: "concrete", templateId: "footing-column" },
      { scene: "room", templateId: "l-shaped-room" },
      { scene: "room", templateId: "t-shaped-room" },
      { scene: "room", templateId: "semicircle-alcove" },
      { scene: "room", templateId: "trapezoid-bay" },
      { scene: "soil", templateId: "half-round-bed" },
      { scene: "soil", templateId: "stepped-bed" },
      { scene: "tank", templateId: "rectangular-tank-trapezoid" },
    ];

    for (const testCase of cases) {
      const template = templateComponents[testCase.scene].find(
        (item) => item.id === testCase.templateId,
      );

      expect(template).toBeDefined();

      if (!template) {
        continue;
      }

      expect(template.components, testCase.templateId).toHaveLength(1);

      const result = calculateProject({
        ...baseProject,
        scene: testCase.scene,
        components: cloneTemplateComponents(template),
      });

      expect(result.valid, testCase.templateId).toBe(true);
      expect(result.componentResults, testCase.templateId).toHaveLength(1);
    }
  });

  it("calculates stacked shipping boxes from the combined stack volume", () => {
    const template = templateComponents.shipping.find(
      (item) => item.id === "mixed-carton-stack",
    );

    expect(template).toBeDefined();

    if (!template) {
      return;
    }

    const result = calculateProject({
      ...baseProject,
      scene: "shipping",
      outputUnits: ["m3", "ft3"],
      shipping: { volumetricDivisor: 5000 },
      components: cloneTemplateComponents(template),
    });

    const bottomCm3 = 60 * 40 * 30;
    const topCm3 = 45 * 35 * 25;

    expect(result.netVolumeM3).toBeCloseTo((bottomCm3 + topCm3) / 1_000_000);
    expect(result.shipping?.totalVolumetricWeightKg).toBeCloseTo(
      (bottomCm3 + topCm3) / 5000,
    );
  });
});
