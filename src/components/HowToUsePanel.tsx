"use client";

import { useState, type ComponentType } from "react";
import { Calculator, CheckCircle2, ListPlus, Ruler } from "lucide-react";
import type { SceneType } from "@/lib/calculator/types";

type IconComponent = ComponentType<{ size?: number; "aria-hidden"?: boolean }>;

type HowToUseOption = {
  id: string;
  label: string;
  summary: string;
  title: string;
  Icon: IconComponent;
  steps: string[];
  sceneTip: Record<SceneType, string>;
};

const howToUseOptions: HowToUseOption[] = [
  {
    id: "quick-start",
    label: "Quick start",
    summary: "Get the first volume",
    title: "Enter one shape and read the live total",
    Icon: Ruler,
    steps: [
      "Choose the shape that matches the object you are measuring.",
      "Enter the required dimensions and confirm the input unit.",
      "Use the result panel to read cubic meters, cubic feet, liters, or gallons.",
    ],
    sceneTip: {
      general: "Start with the default box, then switch shapes when the object is not rectangular.",
      cubic_feet: "Start with length, width, and height in feet for a direct ft³ result.",
      cubic_yards: "Start with length, width, and depth in feet when estimating cubic yards for material orders.",
      shipping: "Start with one carton size, then set the carton quantity before checking CBM.",
      concrete: "Start with the slab, footing, or column dimensions from the drawing.",
      room: "Start with the main room length, width, and height.",
      soil: "Start with bed length, width, and fill depth.",
      tank: "Start with the full tank shape and its outside capacity dimensions.",
    },
  },
  {
    id: "build-project",
    label: "Add details",
    summary: "Use combined shapes",
    title: "Use combined shapes, quantities, and subtractions",
    Icon: ListPlus,
    steps: [
      "Choose a single shape or common assembly in Calculating.",
      "Enter the combined shape parameters in the same form.",
      "Use Item settings for quantity, enabled state, or add/subtract mode.",
    ],
    sceneTip: {
      general: "Use the common assembly presets when an object mixes a few simple sections.",
      cubic_feet: "Use room, cylinder, cube, and L-shape presets when the object is not a simple box.",
      cubic_yards: "Use material presets for beds, trenches, round holes, and yard-dimension inputs.",
      shipping: "Use stack and carton presets for common mixed cargo layouts.",
      concrete: "Subtract sleeves, round holes, and openings from the concrete pour.",
      room: "Use L-shaped, T-shaped, alcove, or bay presets for common room layouts.",
      soil: "Use bed, planter, trench, and step presets, then choose the material.",
      tank: "Use the tank shape presets for full-capacity estimates.",
    },
  },
  {
    id: "check-output",
    label: "Check result",
    summary: "Review and share",
    title: "Verify units, waste, weight, and cost before using the number",
    Icon: Calculator,
    steps: [
      "Open Project options to choose output units and material settings.",
      "Adjust waste factor, density, shipping divisor, or cost if the estimate needs it.",
      "Copy the result or share the URL after the final dimensions are entered.",
    ],
    sceneTip: {
      general: "Keep only the output units you need so the final result is easy to scan.",
      cubic_feet: "Check cubic yards and cubic meters in the result panel when another unit is needed.",
      cubic_yards: "Round the cubic yard result according to supplier bag, truck, or batch sizing.",
      shipping: "Check the volumetric divisor against the carrier before using chargeable weight.",
      concrete: "Confirm the waste percentage with the supplier before ordering.",
      room: "Use cubic feet or cubic meters depending on the HVAC or storage reference you need.",
      soil: "Convert the total into liters or cubic yards, then divide by supplier bag size.",
      tank: "Use liters, gallons, and water weight together when checking capacity.",
    },
  },
];

interface HowToUsePanelProps {
  scene: SceneType;
}

export function HowToUsePanel({ scene }: HowToUsePanelProps) {
  const [activeOptionId, setActiveOptionId] = useState(howToUseOptions[0].id);
  const activeOption =
    howToUseOptions.find((option) => option.id === activeOptionId) ?? howToUseOptions[0];
  const ActiveIcon = activeOption.Icon;

  return (
    <section className="how-to-use" aria-labelledby="how-to-use-title">
      <div className="how-to-panel">
        <div className="how-to-intro">
          <p className="eyebrow">How to use</p>
          <h2 id="how-to-use-title">How to calculate volume for your project</h2>
          <p>
            Switch between these options to match the way you are using the calculator right now.
          </p>
        </div>

        <div className="how-to-options" role="tablist" aria-label="How to use options">
          {howToUseOptions.map((option) => {
            const Icon = option.Icon;
            const isActive = option.id === activeOption.id;

            return (
              <button
                className={isActive ? "active" : undefined}
                key={option.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-controls="how-to-use-panel"
                onClick={() => setActiveOptionId(option.id)}
              >
                <Icon size={17} aria-hidden />
                <span>
                  <strong>{option.label}</strong>
                  <small>{option.summary}</small>
                </span>
              </button>
            );
          })}
        </div>

        <article className="how-to-detail" id="how-to-use-panel" role="tabpanel" tabIndex={0}>
          <div className="how-to-detail-head">
            <span className="how-to-detail-icon">
              <ActiveIcon size={20} aria-hidden />
            </span>
            <h3>{activeOption.title}</h3>
          </div>
          <ol>
            {activeOption.steps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
          <p className="how-to-tip">
            <CheckCircle2 size={16} aria-hidden />
            <span>{activeOption.sceneTip[scene]}</span>
          </p>
        </article>
      </div>
    </section>
  );
}
