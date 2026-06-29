"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { RotateCcw } from "lucide-react";
import { CURRENCIES, MATERIALS, VOLUME_UNITS } from "@/lib/calculator/constants";
import { calculateProject } from "@/lib/calculator/calculateProject";
import { cloneProject } from "@/lib/calculator/presets";
import { decodeProjectState } from "@/lib/calculator/serialization";
import type {
  CalculatorProject,
  CurrencyCode,
  MaterialType,
  SceneType,
  VolumeUnit,
} from "@/lib/calculator/types";
import { ComponentEditor } from "./ComponentEditor";
import { DynamicProjectModel } from "./DynamicProjectModel";
import { ResultsPanel } from "./ResultsPanel";
import { VolumeConverter } from "./VolumeConverter";

interface CalculatorLayoutProps {
  scene: SceneType;
  title: string;
  description: string;
}

export function CalculatorLayout({ scene, title, description }: CalculatorLayoutProps) {
  const [project, setProject] = useState<CalculatorProject>(() => cloneProject(scene));
  const [activeComponentId, setActiveComponentId] = useState("component-1");
  const [stateMessage, setStateMessage] = useState("");
  const restoredRef = useRef(false);
  const result = useMemo(() => calculateProject(project), [project]);
  const cost = project.cost ?? {
    enabled: false,
    costPerVolume: 0,
    volumeUnit: "m3" as VolumeUnit,
    currency: "USD" as CurrencyCode,
  };
  const selectedComponentId = project.components.some((component) => component.id === activeComponentId)
    ? activeComponentId
    : project.components[0]?.id ?? "";

  useEffect(() => {
    if (restoredRef.current) {
      return;
    }

    restoredRef.current = true;
    const params = new URLSearchParams(window.location.search);
    const encodedState = params.get("state");

    if (!encodedState) {
      return;
    }

    window.setTimeout(() => {
      const restored = decodeProjectState(encodedState);
      if (restored) {
        setProject({
          ...restored,
          scene,
        });
        setActiveComponentId(restored.components[0]?.id ?? "");
        setStateMessage("Shared project restored from the URL.");
      } else {
        const nextProject = cloneProject(scene);
        setProject(nextProject);
        setActiveComponentId(nextProject.components[0]?.id ?? "");
        setStateMessage("The shared state could not be read, so the default preset was loaded.");
      }
    }, 0);
  }, [scene]);

  function resetProject() {
    const nextProject = cloneProject(scene);
    setProject(nextProject);
    setActiveComponentId(nextProject.components[0]?.id ?? "");
    setStateMessage("Default preset restored.");
  }

  function updateOutputUnit(unit: VolumeUnit, enabled: boolean) {
    const nextUnits = enabled
      ? Array.from(new Set([...project.outputUnits, unit]))
      : project.outputUnits.filter((existing) => existing !== unit);

    setProject({
      ...project,
      outputUnits: nextUnits.length ? nextUnits : ["m3"],
    });
  }

  return (
    <section className="workbench">
      <header className="tool-head">
        <div className="tool-head-text">
          <p className="eyebrow">Volume calculator</p>
          <h1>{title}</h1>
          <p className="lede">{description}</p>
        </div>
        <button className="ghost-button reset-button" type="button" onClick={resetProject}>
          <RotateCcw size={15} aria-hidden />
          Reset
        </button>
      </header>

      {stateMessage ? (
        <p className="banner" role="status">
          {stateMessage}
        </p>
      ) : null}

      <div className="workbench-stack">
        <section className="visual-stage" aria-label="Live 3D model and result">
          <div className="model-card">
            <DynamicProjectModel project={project} selectedComponentId={selectedComponentId} />
          </div>
          <ResultsPanel project={project} result={result} />
        </section>

        <div className="work-input">
          <ComponentEditor
            project={project}
            result={result}
            activeComponentId={selectedComponentId}
            onActiveComponentChange={setActiveComponentId}
            onChange={setProject}
          />

          <div className="converter-section">
            <VolumeConverter />
          </div>

          <details className="panel options-panel">
            <summary>
              <span>Project options</span>
              <small>Units, material, cost, and waste</small>
            </summary>
            <div className="options-grid">
              <label className="field">
                <span>Project name</span>
                <input
                  type="text"
                  value={project.projectName}
                  onChange={(event) =>
                    setProject({
                      ...project,
                      projectName: event.target.value,
                    })
                  }
                />
              </label>
              <label className="field">
                <span>Waste factor %</span>
                <input
                  min="0"
                  step="any"
                  type="number"
                  value={project.wasteFactorPercent}
                  onChange={(event) =>
                    setProject({
                      ...project,
                      wasteFactorPercent: Number(event.target.value),
                    })
                  }
                />
              </label>
              <div className="field field-group">
                <span>Output units</span>
                <div className="unit-checks">
                  {VOLUME_UNITS.map((unit) => (
                    <label className="check" key={unit.id}>
                      <input
                        type="checkbox"
                        checked={project.outputUnits.includes(unit.id)}
                        onChange={(event) => updateOutputUnit(unit.id, event.target.checked)}
                      />
                      <span>{unit.id}</span>
                    </label>
                  ))}
                </div>
              </div>
              <label className="field">
                <span>Material</span>
                <select
                  value={project.material}
                  onChange={(event) =>
                    setProject({
                      ...project,
                      material: event.target.value as MaterialType,
                    })
                  }
                >
                  {MATERIALS.map((material) => (
                    <option value={material.id} key={material.id}>
                      {material.label}
                      {material.densityKgPerM3 ? ` · ${material.densityKgPerM3} kg/m³` : ""}
                    </option>
                  ))}
                </select>
              </label>
              {project.material === "custom" ? (
                <label className="field">
                  <span>Custom density kg/m³</span>
                  <input
                    min="0"
                    step="any"
                    type="number"
                    value={project.customDensityKgPerM3 ?? ""}
                    onChange={(event) =>
                      setProject({
                        ...project,
                        customDensityKgPerM3: Number(event.target.value),
                      })
                    }
                  />
                </label>
              ) : null}
              {project.scene === "shipping" ? (
                <>
                  <label className="field">
                    <span>Volumetric divisor</span>
                    <select
                      value={project.shipping?.volumetricDivisor ?? 5000}
                      onChange={(event) =>
                        setProject({
                          ...project,
                          shipping: {
                            actualWeightKg: project.shipping?.actualWeightKg,
                            volumetricDivisor: Number(event.target.value),
                          },
                        })
                      }
                    >
                      <option value={5000}>5000</option>
                      <option value={6000}>6000</option>
                      <option value={4000}>4000 custom</option>
                    </select>
                  </label>
                  <label className="field">
                    <span>Actual weight kg</span>
                    <input
                      min="0"
                      step="any"
                      type="number"
                      value={project.shipping?.actualWeightKg ?? ""}
                      onChange={(event) =>
                        setProject({
                          ...project,
                          shipping: {
                            volumetricDivisor: project.shipping?.volumetricDivisor ?? 5000,
                            actualWeightKg:
                              event.target.value === "" ? undefined : Number(event.target.value),
                          },
                        })
                      }
                    />
                  </label>
                </>
              ) : null}
              <div className="field field-group">
                <span>Cost estimate</span>
                <label className="toggle">
                  <input
                    type="checkbox"
                    checked={cost.enabled}
                    onChange={(event) =>
                      setProject({
                        ...project,
                        cost: {
                          ...cost,
                          enabled: event.target.checked,
                        },
                      })
                    }
                  />
                  <span>Enabled</span>
                </label>
              </div>
              <label className="field">
                <span>Cost per volume</span>
                <input
                  min="0"
                  step="any"
                  type="number"
                  value={cost.costPerVolume}
                  disabled={!cost.enabled}
                  onChange={(event) =>
                    setProject({
                      ...project,
                      cost: {
                        ...cost,
                        costPerVolume: Number(event.target.value),
                      },
                    })
                  }
                />
              </label>
              <label className="field">
                <span>Cost volume unit</span>
                <select
                  value={cost.volumeUnit}
                  disabled={!cost.enabled}
                  onChange={(event) =>
                    setProject({
                      ...project,
                      cost: {
                        ...cost,
                        volumeUnit: event.target.value as VolumeUnit,
                      },
                    })
                  }
                >
                  {VOLUME_UNITS.map((unit) => (
                    <option value={unit.id} key={unit.id}>
                      {unit.id}
                    </option>
                  ))}
                </select>
              </label>
              <label className="field">
                <span>Currency</span>
                <select
                  value={cost.currency}
                  disabled={!cost.enabled}
                  onChange={(event) =>
                    setProject({
                      ...project,
                      cost: {
                        ...cost,
                        currency: event.target.value as CurrencyCode,
                      },
                    })
                  }
                >
                  {CURRENCIES.map((currency) => (
                    <option value={currency} key={currency}>
                      {currency}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </details>
        </div>
      </div>
    </section>
  );
}
