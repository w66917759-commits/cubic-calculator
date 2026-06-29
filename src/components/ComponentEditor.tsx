"use client";

import { useState } from "react";
import {
  cloneTemplate,
  cloneTemplateComponents,
  templateComponents,
} from "@/lib/calculator/presets";
import type { ComponentTemplate } from "@/lib/calculator/presets";
import type {
  CalculatorProject,
  ProjectCalculationResult,
  ShapeComponent,
} from "@/lib/calculator/types";
import { ComponentCard } from "./ComponentCard";

interface ComponentEditorProps {
  project: CalculatorProject;
  result: ProjectCalculationResult;
  activeComponentId?: string;
  onActiveComponentChange: (componentId: string) => void;
  onChange: (project: CalculatorProject) => void;
}

function inferSelectedTemplateId(
  components: ShapeComponent[],
  templates: ComponentTemplate[],
) {
  if (components.length === 0) {
    return templates[0]?.id ?? "";
  }

  if (components.length === 1) {
    const component = components[0];
    const exactMatch = templates.find((template) => {
      const templateComponent = template.components[0];

      return (
        template.components.length === 1 &&
        templateComponent?.shape === component.shape &&
        templateComponent.operation === component.operation &&
        templateComponent.name === component.name
      );
    });

    return (
      exactMatch?.id ??
      templates.find((template) => template.components[0]?.shape === component.shape)?.id ??
      templates[0]?.id ??
      ""
    );
  }

  return (
    templates.find(
      (template) =>
        template.components.length === components.length &&
        template.components.every((templateComponent, index) => {
          const component = components[index];

          return (
            component &&
            component.shape === templateComponent.shape &&
            component.operation === templateComponent.operation &&
            component.name === templateComponent.name
          );
        }),
    )?.id ??
    ""
  );
}

export function ComponentEditor({
  project,
  result,
  activeComponentId,
  onActiveComponentChange,
  onChange,
}: ComponentEditorProps) {
  const templates = templateComponents[project.scene];
  const inferredTemplateId = inferSelectedTemplateId(project.components, templates);
  const [selectedTemplateId, setSelectedTemplateId] = useState("");
  const activeTemplateId = inferredTemplateId || selectedTemplateId || templates[0]?.id || "";
  const selectedTemplate =
    templates.find((template) => template.id === activeTemplateId) ?? templates[0];
  const templateCategories = Array.from(
    new Set(templates.map((template) => template.category)),
  );
  const activeComponent =
    project.components.find((component) => component.id === activeComponentId) ??
    project.components[0];

  function updateComponent(nextComponent: ShapeComponent) {
    onChange({
      ...project,
      components: project.components.map((component) =>
        component.id === nextComponent.id ? nextComponent : component,
      ),
    });
  }

  function applyTemplate(templateItem: ComponentTemplate) {
    const nextComponents = cloneTemplateComponents(templateItem);

    if (nextComponents.length === 0) {
      return;
    }

    onChange({
      ...project,
      components: nextComponents,
    });
    onActiveComponentChange(nextComponents[0].id);
  }

  function selectTemplate(templateId: string) {
    const templateItem = templates.find((template) => template.id === templateId);

    setSelectedTemplateId(templateId);

    if (templateItem) {
      applyTemplate(templateItem);
    }
  }

  function duplicateComponent(component: ShapeComponent) {
    const nextComponent = cloneTemplate(component);

    onChange({
      ...project,
      components: [...project.components, nextComponent],
    });
    onActiveComponentChange(nextComponent.id);
  }

  function deleteComponent(componentId: string) {
    if (project.components.length <= 1) {
      return;
    }

    const nextComponents = project.components.filter((component) => component.id !== componentId);

    onChange({
      ...project,
      components: nextComponents,
    });

    if (activeComponentId === componentId && nextComponents[0]) {
      onActiveComponentChange(nextComponents[0].id);
    }
  }

  return (
    <section className="input-panel" aria-label="Volume input">
      <div className="panel-head">
        <h2>Calculating</h2>
      </div>

      {activeComponent ? (
        <ComponentCard
          component={activeComponent}
          result={result.componentResults.find(
            (componentResult) => componentResult.componentId === activeComponent.id,
          )}
          isActive
          canDelete={project.components.length > 1}
          showAdvanced={false}
          shapeControl={
            <label className="field">
              <span>Shape</span>
              <select
                value={selectedTemplate?.id ?? ""}
                onChange={(event) => selectTemplate(event.target.value)}
              >
                {templateCategories.map((category) => (
                  <optgroup label={category} key={category}>
                    {templates
                      .filter((template) => template.category === category)
                      .map((template) => (
                        <option value={template.id} key={template.id}>
                          {template.name}
                        </option>
                      ))}
                  </optgroup>
                ))}
              </select>
            </label>
          }
          onChange={updateComponent}
          onEdit={() => onActiveComponentChange(activeComponent.id)}
          onDuplicate={() => duplicateComponent(activeComponent)}
          onDelete={() => deleteComponent(activeComponent.id)}
        />
      ) : null}

      {project.components.length > 1 ? (
        <div className="component-list calculation-items" aria-label="Calculation items">
          {project.components.map((component) => (
            <ComponentCard
              key={component.id}
              component={component}
              result={result.componentResults.find(
                (componentResult) => componentResult.componentId === component.id,
              )}
              isActive={false}
              canDelete={project.components.length > 1}
              showAdvanced
              isSelected={component.id === activeComponentId}
              onChange={updateComponent}
              onEdit={() => onActiveComponentChange(component.id)}
              onDuplicate={() => duplicateComponent(component)}
              onDelete={() => deleteComponent(component.id)}
            />
          ))}
        </div>
      ) : null}
    </section>
  );
}
