"use client";

import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { calculateComponent } from "@/lib/calculator/calculateComponent";
import {
  getComponentAssemblySizeM,
  getComponentBounds,
  normalizePlacement,
  type ComponentAssemblySize,
} from "@/lib/calculator/assembly";
import { getShapeDefinition } from "@/lib/calculator/shapes";
import { formatNumber, lengthToMeters } from "@/lib/calculator/units";
import type { CalculatorProject, ShapeComponent } from "@/lib/calculator/types";

interface DynamicProjectModelProps {
  project: CalculatorProject;
  selectedComponentId?: string;
}

interface ModelItem {
  component: ShapeComponent;
  dimensions: ComponentAssemblySize;
  selected: boolean;
  muted: boolean;
  scale: number;
  x: number;
  y: number;
  z: number;
  rotationY: number;
}

interface ModelSegment {
  geometry: THREE.BufferGeometry;
  x?: number;
  y?: number;
  z?: number;
  rotationY?: number;
}

function shapeMaxDimension(dimensions: ComponentAssemblySize) {
  return Math.max(dimensions.width, dimensions.depth, dimensions.height, 0.1);
}

function formatMeterLabel(value: number | undefined) {
  return `${formatNumber(value ?? 0, 2)} m`;
}

function makeDashedSegments(
  geometry: THREE.BufferGeometry,
  color: THREE.ColorRepresentation,
  opacity: number,
  dashSize = 0.12,
  gapSize = 0.07,
) {
  const line = new THREE.LineSegments(
    geometry,
    new THREE.LineDashedMaterial({
      color,
      dashSize,
      gapSize,
      transparent: true,
      opacity,
      depthWrite: false,
    }),
  );

  line.computeLineDistances();

  return line;
}

function makeExtrudedGeometry(shape: THREE.Shape, depth: number) {
  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth,
    bevelEnabled: false,
    curveSegments: 36,
    steps: 1,
  });

  geometry.center();

  return geometry;
}

function makeFootprintGeometry(shape: THREE.Shape, height: number) {
  const geometry = makeExtrudedGeometry(shape, height);

  geometry.rotateX(-Math.PI / 2);

  return geometry;
}

function makeHalfCylinderGeometry(width: number, depth: number, height: number) {
  const radius = width / 2;
  const shape = new THREE.Shape();

  shape.moveTo(-radius, 0);
  for (let index = 0; index <= 36; index += 1) {
    const angle = Math.PI - (Math.PI * index) / 36;
    shape.lineTo(Math.cos(angle) * radius, Math.sin(angle) * height);
  }
  shape.lineTo(-radius, 0);

  return makeExtrudedGeometry(shape, depth);
}

function makeTriangularPrismGeometry(width: number, depth: number, height: number) {
  const shape = new THREE.Shape();

  shape.moveTo(-width / 2, -height / 2);
  shape.lineTo(width / 2, -height / 2);
  shape.lineTo(-width / 2, height / 2);
  shape.lineTo(-width / 2, -height / 2);

  return makeExtrudedGeometry(shape, depth);
}

function makeTrapezoidalPrismGeometry(
  width: number,
  depth: number,
  height: number,
  topRatio = 0.65,
  bottomRatio = 1,
) {
  const topWidth = width * topRatio;
  const bottomWidth = width * bottomRatio;
  const shape = new THREE.Shape();

  shape.moveTo(-bottomWidth / 2, -height / 2);
  shape.lineTo(bottomWidth / 2, -height / 2);
  shape.lineTo(topWidth / 2, height / 2);
  shape.lineTo(-topWidth / 2, height / 2);
  shape.lineTo(-bottomWidth / 2, -height / 2);

  return makeExtrudedGeometry(shape, depth);
}

function dimensionM(component: ShapeComponent, key: string, scale: number) {
  const value = component.dimensions[key];

  return lengthToMeters(Number.isFinite(value) ? value : 0.1, component.unit) * scale;
}

function makeRectangleSemicircleGeometry(component: ShapeComponent, scale: number) {
  const rectLength = dimensionM(component, "rectLength", scale);
  const rectWidth = dimensionM(component, "width", scale);
  const radius = dimensionM(component, "radius", scale);
  const height = dimensionM(component, "height", scale);
  const shape = new THREE.Shape();
  const halfRectWidth = rectWidth / 2;

  shape.moveTo(0, -halfRectWidth);
  shape.lineTo(rectLength, -halfRectWidth);
  shape.lineTo(rectLength, -radius);
  for (let index = 0; index <= 36; index += 1) {
    const angle = -Math.PI / 2 + (Math.PI * index) / 36;
    shape.lineTo(rectLength + Math.cos(angle) * radius, Math.sin(angle) * radius);
  }
  shape.lineTo(rectLength, halfRectWidth);
  shape.lineTo(0, halfRectWidth);
  shape.lineTo(0, -halfRectWidth);

  return makeFootprintGeometry(shape, height);
}

function makeRectangleTrapezoidGeometry(component: ShapeComponent, scale: number) {
  const rectLength = dimensionM(component, "rectLength", scale);
  const rectWidth = dimensionM(component, "rectWidth", scale);
  const trapTopWidth = dimensionM(component, "trapTopWidth", scale);
  const trapBottomWidth = dimensionM(component, "trapBottomWidth", scale);
  const trapLength = dimensionM(component, "trapLength", scale);
  const height = dimensionM(component, "height", scale);
  const shape = new THREE.Shape();

  shape.moveTo(0, -rectWidth / 2);
  shape.lineTo(rectLength, -rectWidth / 2);
  shape.lineTo(rectLength + trapLength, -trapBottomWidth / 2);
  shape.lineTo(rectLength + trapLength, trapTopWidth / 2);
  shape.lineTo(rectLength, rectWidth / 2);
  shape.lineTo(0, rectWidth / 2);
  shape.lineTo(0, -rectWidth / 2);

  return makeFootprintGeometry(shape, height);
}

function makeLShapeGeometry(component: ShapeComponent, scale: number) {
  const mainLength = dimensionM(component, "mainLength", scale);
  const mainWidth = dimensionM(component, "mainWidth", scale);
  const legLength = dimensionM(component, "legLength", scale);
  const legWidth = dimensionM(component, "legWidth", scale);
  const height = dimensionM(component, "height", scale);
  const shape = new THREE.Shape();

  shape.moveTo(0, 0);
  shape.lineTo(mainLength, 0);
  shape.lineTo(mainLength, mainWidth);
  shape.lineTo(legWidth, mainWidth);
  shape.lineTo(legWidth, mainWidth + legLength);
  shape.lineTo(0, mainWidth + legLength);
  shape.lineTo(0, 0);

  return makeFootprintGeometry(shape, height);
}

function makeTShapeGeometry(component: ShapeComponent, scale: number) {
  const stemLength = dimensionM(component, "stemLength", scale);
  const stemWidth = dimensionM(component, "stemWidth", scale);
  const crossLength = dimensionM(component, "crossLength", scale);
  const crossWidth = dimensionM(component, "crossWidth", scale);
  const height = dimensionM(component, "height", scale);
  const shape = new THREE.Shape();

  shape.moveTo(-stemWidth / 2, 0);
  shape.lineTo(stemWidth / 2, 0);
  shape.lineTo(stemWidth / 2, stemLength);
  shape.lineTo(crossLength / 2, stemLength);
  shape.lineTo(crossLength / 2, stemLength + crossWidth);
  shape.lineTo(-crossLength / 2, stemLength + crossWidth);
  shape.lineTo(-crossLength / 2, stemLength);
  shape.lineTo(-stemWidth / 2, stemLength);
  shape.lineTo(-stemWidth / 2, 0);

  return makeFootprintGeometry(shape, height);
}

function makeGeometry(component: ShapeComponent, dimensions: ComponentAssemblySize) {
  const width = Math.max(0.08, dimensions.width);
  const depth = Math.max(0.08, dimensions.depth);
  const height = Math.max(0.08, dimensions.height);
  const radius = Math.max(width, depth) / 2;

  switch (component.shape) {
    case "cylinder":
    case "tube":
      return new THREE.CylinderGeometry(radius, radius, height, 72, 1, false);
    case "cone":
      return new THREE.ConeGeometry(radius, height, 72);
    case "frustum":
      return new THREE.CylinderGeometry(
        radius * (dimensions.topRatio ?? 0.62),
        radius * (dimensions.bottomRatio ?? 1),
        height,
        72,
      );
    case "sphere":
      return new THREE.SphereGeometry(radius, 72, 36);
    case "hemisphere":
      return new THREE.SphereGeometry(radius, 72, 18, 0, Math.PI * 2, 0, Math.PI / 2);
    case "half_cylinder":
      return makeHalfCylinderGeometry(width, depth, height);
    case "triangular_prism":
      return makeTriangularPrismGeometry(width, depth, height);
    case "trapezoidal_prism":
      return makeTrapezoidalPrismGeometry(
        width,
        depth,
        height,
        dimensions.topRatio,
        dimensions.bottomRatio,
      );
    default:
      return new THREE.BoxGeometry(width, height, depth, 1, 1, 1);
  }
}

function makeStackedBoxSegments(
  component: ShapeComponent,
  scale: number,
  lowerPrefix: "lower" | "bottom",
  upperPrefix: "upper" | "top",
): ModelSegment[] {
  const lowerLength = dimensionM(component, `${lowerPrefix}Length`, scale);
  const lowerWidth = dimensionM(component, `${lowerPrefix}Width`, scale);
  const lowerHeight = dimensionM(component, `${lowerPrefix}Height`, scale);
  const upperLength = dimensionM(component, `${upperPrefix}Length`, scale);
  const upperWidth = dimensionM(component, `${upperPrefix}Width`, scale);
  const upperHeight = dimensionM(component, `${upperPrefix}Height`, scale);
  const totalHeight = lowerHeight + upperHeight;

  return [
    {
      geometry: new THREE.BoxGeometry(lowerLength, lowerHeight, lowerWidth, 1, 1, 1),
      y: -totalHeight / 2 + lowerHeight / 2,
    },
    {
      geometry: new THREE.BoxGeometry(upperLength, upperHeight, upperWidth, 1, 1, 1),
      y: -totalHeight / 2 + lowerHeight + upperHeight / 2,
    },
  ];
}

function makeBoxCylinderStackSegments(component: ShapeComponent, scale: number): ModelSegment[] {
  const baseLength = dimensionM(component, "baseLength", scale);
  const baseWidth = dimensionM(component, "baseWidth", scale);
  const baseHeight = dimensionM(component, "baseHeight", scale);
  const radius = dimensionM(component, "radius", scale);
  const cylinderHeight = dimensionM(component, "cylinderHeight", scale);
  const totalHeight = baseHeight + cylinderHeight;

  return [
    {
      geometry: new THREE.BoxGeometry(baseLength, baseHeight, baseWidth, 1, 1, 1),
      y: -totalHeight / 2 + baseHeight / 2,
    },
    {
      geometry: new THREE.CylinderGeometry(radius, radius, cylinderHeight, 72, 1, false),
      y: -totalHeight / 2 + baseHeight + cylinderHeight / 2,
    },
  ];
}

function makeBoxTrapezoidSumpSegments(component: ShapeComponent, scale: number): ModelSegment[] {
  const boxLength = dimensionM(component, "boxLength", scale);
  const boxWidth = dimensionM(component, "boxWidth", scale);
  const boxHeight = dimensionM(component, "boxHeight", scale);
  const sumpTopWidth = dimensionM(component, "sumpTopWidth", scale);
  const sumpBottomWidth = dimensionM(component, "sumpBottomWidth", scale);
  const sumpDepth = dimensionM(component, "sumpDepth", scale);
  const sumpHeight = dimensionM(component, "sumpHeight", scale);
  const maxSumpWidth = Math.max(sumpTopWidth, sumpBottomWidth, 0.08);
  const totalHeight = boxHeight + sumpHeight;

  return [
    {
      geometry: new THREE.BoxGeometry(boxLength, boxHeight, boxWidth, 1, 1, 1),
      y: -totalHeight / 2 + sumpHeight + boxHeight / 2,
    },
    {
      geometry: makeTrapezoidalPrismGeometry(
        maxSumpWidth,
        sumpDepth,
        sumpHeight,
        Math.max(0.18, sumpTopWidth / maxSumpWidth),
        Math.max(0.18, sumpBottomWidth / maxSumpWidth),
      ),
      y: -totalHeight / 2 + sumpHeight / 2,
    },
  ];
}

function makeModelSegments(item: ModelItem): ModelSegment[] {
  switch (item.component.shape) {
    case "rectangle_semicircle":
      return [{ geometry: makeRectangleSemicircleGeometry(item.component, item.scale) }];
    case "rectangle_trapezoid":
      return [{ geometry: makeRectangleTrapezoidGeometry(item.component, item.scale) }];
    case "l_shape":
      return [{ geometry: makeLShapeGeometry(item.component, item.scale) }];
    case "t_shape":
      return [{ geometry: makeTShapeGeometry(item.component, item.scale) }];
    case "stepped_boxes":
      return makeStackedBoxSegments(item.component, item.scale, "lower", "upper");
    case "stacked_boxes":
      return makeStackedBoxSegments(item.component, item.scale, "bottom", "top");
    case "box_cylinder_stack":
      return makeBoxCylinderStackSegments(item.component, item.scale);
    case "box_trapezoid_sump":
      return makeBoxTrapezoidSumpSegments(item.component, item.scale);
    default:
      return [{ geometry: makeGeometry(item.component, item.dimensions) }];
  }
}

function disposeObject(object: THREE.Object3D) {
  object.traverse((child) => {
    if (
      child instanceof THREE.Mesh ||
      child instanceof THREE.Line ||
      child instanceof THREE.LineSegments ||
      child instanceof THREE.Points
    ) {
      child.geometry.dispose();

      const material = child.material;
      if (Array.isArray(material)) {
        material.forEach((item) => item.dispose());
      } else {
        material.dispose();
      }
    }
  });
}

export function DynamicProjectModel({
  project,
  selectedComponentId,
}: DynamicProjectModelProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const selectedComponent =
    project.components.find((component) => component.id === selectedComponentId) ??
    project.components.find((component) => component.enabled) ??
    project.components[0];
  const selectedShape = selectedComponent ? getShapeDefinition(selectedComponent.shape) : undefined;
  const selectedDimensions = selectedComponent
    ? getComponentAssemblySizeM(selectedComponent)
    : undefined;
  const selectedCalculation = selectedComponent
    ? calculateComponent(selectedComponent)
    : undefined;
  const modelMetrics = [
    { label: "W", value: formatMeterLabel(selectedDimensions?.width) },
    { label: "D", value: formatMeterLabel(selectedDimensions?.depth) },
    { label: "H", value: formatMeterLabel(selectedDimensions?.height) },
  ];
  const modelItems = useMemo<ModelItem[]>(() => {
    const visibleComponents = project.components.slice(0, 8);
    const rawDimensions = visibleComponents.map(getComponentAssemblySizeM);
    const rawBounds = visibleComponents.map(getComponentBounds);
    const minX = Math.min(...rawBounds.map((bounds) => bounds.minX), -0.5);
    const maxX = Math.max(...rawBounds.map((bounds) => bounds.maxX), 0.5);
    const minY = Math.min(...rawBounds.map((bounds) => bounds.minY), 0);
    const maxY = Math.max(...rawBounds.map((bounds) => bounds.maxY), 0.5);
    const minZ = Math.min(...rawBounds.map((bounds) => bounds.minZ), -0.5);
    const maxZ = Math.max(...rawBounds.map((bounds) => bounds.maxZ), 0.5);
    const centerX = (minX + maxX) / 2;
    const centerZ = (minZ + maxZ) / 2;
    const maxSpan = Math.max(maxX - minX, maxY - minY, maxZ - minZ, 0.1);
    const maxSingleDimension = Math.max(...rawDimensions.map(shapeMaxDimension), 0.1);
    const scale = Math.min(3.85 / maxSpan, 2.55 / maxSingleDimension);

    return visibleComponents.map((component, index) => ({
      component,
      dimensions: {
        ...rawDimensions[index],
        width: rawDimensions[index].width * scale,
        depth: rawDimensions[index].depth * scale,
        height: rawDimensions[index].height * scale,
      },
      selected: component.id === selectedComponent?.id,
      muted: !component.enabled,
      scale,
      x: (((rawBounds[index].minX + rawBounds[index].maxX) / 2) - centerX) * scale,
      y: (((rawBounds[index].minY + rawBounds[index].maxY) / 2) - minY) * scale,
      z: (((rawBounds[index].minZ + rawBounds[index].maxZ) / 2) - centerZ) * scale,
      rotationY: (normalizePlacement(component.placement).rotationYDeg * Math.PI) / 180,
    }));
  }, [project.components, selectedComponent?.id]);

  useEffect(() => {
    const host = hostRef.current;
    const canvas = canvasRef.current;

    if (!host || !canvas) {
      return;
    }

    const hostElement = host;
    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0xf4f5f7, 9, 24);

    const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);
    camera.position.set(5.8, 4.0, 6.9);
    camera.lookAt(0, 0.58, 0);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      preserveDrawingBuffer: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.shadowMap.enabled = false;
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    const ambient = new THREE.HemisphereLight(0xffffff, 0xd7dbe2, 1.9);
    const key = new THREE.DirectionalLight(0xffffff, 2.1);
    key.position.set(3.8, 7.5, 4.5);

    const rim = new THREE.DirectionalLight(0xe5e7eb, 1.1);
    rim.position.set(-5.5, 3.8, -4.8);

    scene.add(ambient, key, rim);

    const modelGroup = new THREE.Group();
    const objectGroup = new THREE.Group();
    modelGroup.add(objectGroup);

    const floor = new THREE.Mesh(
      new THREE.CylinderGeometry(5.2, 5.2, 0.025, 128),
      new THREE.MeshBasicMaterial({
        color: 0xf2f3f5,
        transparent: true,
        opacity: 0.72,
        depthWrite: false,
      }),
    );
    floor.position.y = -0.04;
    modelGroup.add(floor);

    const grid = new THREE.GridHelper(7.6, 12, 0x9ca3af, 0xd4d8de);
    grid.position.y = 0.01;
    const gridMaterial = grid.material;
    if (!Array.isArray(gridMaterial)) {
      gridMaterial.transparent = true;
      gridMaterial.opacity = 0.24;
    }
    modelGroup.add(grid);

    modelItems.forEach((item) => {
      const isSubtract = item.component.operation === "subtract";
      const itemGroup = new THREE.Group();

      itemGroup.position.set(item.x, item.y, item.z);
      itemGroup.rotation.y = item.rotationY;
      itemGroup.userData.selected = item.selected;
      itemGroup.userData.baseY = itemGroup.position.y;

      const makeMaterial = () =>
        new THREE.MeshPhysicalMaterial({
          color: item.selected ? 0xf9fafb : isSubtract ? 0xb6bbc3 : 0xe5e7eb,
          roughness: 0.34,
          metalness: 0,
          transparent: true,
          opacity: item.muted ? 0.035 : isSubtract ? 0.08 : item.selected ? 0.16 : 0.07,
          side: THREE.DoubleSide,
          depthWrite: false,
        });
      const edgeColor = item.selected ? 0x111827 : isSubtract ? 0x6b7280 : 0x4b5563;

      makeModelSegments(item).forEach((segment) => {
        const mesh = new THREE.Mesh(segment.geometry, makeMaterial());
        mesh.position.set(segment.x ?? 0, segment.y ?? 0, segment.z ?? 0);
        mesh.rotation.y = segment.rotationY ?? 0;

        const edges = makeDashedSegments(
          new THREE.EdgesGeometry(segment.geometry, 12),
          edgeColor,
          item.muted ? 0.16 : item.selected ? 0.82 : 0.38,
          item.selected ? 0.12 : 0.08,
          item.selected ? 0.06 : 0.05,
        );
        edges.position.copy(mesh.position);
        edges.rotation.copy(mesh.rotation);

        const wire = new THREE.LineSegments(
          new THREE.WireframeGeometry(segment.geometry),
          new THREE.LineBasicMaterial({
            color: edgeColor,
            transparent: true,
            opacity: item.muted ? 0.08 : item.selected ? 0.2 : 0.08,
            depthWrite: false,
          }),
        );
        wire.position.copy(mesh.position);
        wire.rotation.copy(mesh.rotation);

        itemGroup.add(mesh, wire, edges);
      });

      objectGroup.add(itemGroup);
    });

    objectGroup.position.y = 0.05;
    modelGroup.rotation.x = -0.04;
    scene.add(modelGroup);

    function renderStill() {
      modelGroup.rotation.y = 0.32;
      modelGroup.position.set(0, 0, 0);

      objectGroup.children.forEach((child) => {
        if (child.userData.selected) {
          child.position.y = child.userData.baseY;
        }
      });

      renderer.render(scene, camera);
    }

    const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    function resize() {
      const { width, height } = hostElement.getBoundingClientRect();
      const nextWidth = Math.max(1, width);
      const nextHeight = Math.max(1, height);

      renderer.setSize(nextWidth, nextHeight, false);
      camera.aspect = nextWidth / nextHeight;
      camera.updateProjectionMatrix();

      if (reducedMotionQuery.matches) {
        renderStill();
      }
    }

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(hostElement);
    resize();

    let frame = 0;
    const animate = (time: number) => {
      const seconds = time / 1000;
      modelGroup.rotation.y = Math.sin(seconds * 0.38) * 0.2 + seconds * 0.08;
      modelGroup.position.set(0, Math.sin(seconds * 0.86) * 0.07, 0);

      objectGroup.children.forEach((child, index) => {
        if (child.userData.selected) {
          child.position.y = child.userData.baseY + Math.sin(seconds * 1.8 + index) * 0.045;
        }
      });

      renderer.render(scene, camera);
      frame = window.requestAnimationFrame(animate);
    };

    function syncMotionPreference() {
      if (reducedMotionQuery.matches) {
        if (frame) {
          window.cancelAnimationFrame(frame);
          frame = 0;
        }
        renderStill();
        return;
      }

      if (!frame) {
        frame = window.requestAnimationFrame(animate);
      }
    }

    reducedMotionQuery.addEventListener("change", syncMotionPreference);
    syncMotionPreference();

    return () => {
      if (frame) {
        window.cancelAnimationFrame(frame);
      }
      reducedMotionQuery.removeEventListener("change", syncMotionPreference);
      resizeObserver.disconnect();
      disposeObject(modelGroup);
      renderer.dispose();
    };
  }, [modelItems]);

  return (
    <figure className="model-stage" aria-label="Live 3D project model">
      <div className="model-stage-canvas" ref={hostRef}>
        <canvas className="dynamic-model-canvas" ref={canvasRef} aria-hidden="true" />
        <div className="model-stage-overlay" aria-hidden="true">
          <div className="model-stage-hud">
            {modelMetrics.map((metric) => (
              <span className="model-metric" key={metric.label}>
                <b>{metric.label}</b>
                {metric.value}
              </span>
            ))}
          </div>
          <div className="model-stage-equation">
            <span>{selectedShape?.shortLabel ?? "Shape"}</span>
            <strong>ΣV {formatNumber(selectedCalculation?.signedVolumeM3 ?? 0)} m³</strong>
          </div>
        </div>
      </div>
      <figcaption className="model-stage-caption">
        <span className="model-stage-live">
          <span className="live-dot" aria-hidden />
          Live model
        </span>
        <span className="model-stage-shape">
          {selectedComponent?.name ?? "No shape"} · {selectedShape?.shortLabel ?? "--"}
        </span>
      </figcaption>
    </figure>
  );
}
