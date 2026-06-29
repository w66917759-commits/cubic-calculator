import type { LengthUnit, VolumeUnit } from "./types";

export const LENGTH_TO_METER: Record<LengthUnit, number> = {
  mm: 0.001,
  cm: 0.01,
  m: 1,
  in: 0.0254,
  ft: 0.3048,
  yd: 0.9144,
};

export const M3_TO_VOLUME_UNIT: Record<VolumeUnit, number> = {
  m3: 1,
  cm3: 1_000_000,
  mm3: 1_000_000_000,
  ft3: 35.3146667,
  in3: 61023.7441,
  yd3: 1.30795062,
  l: 1000,
  ml: 1_000_000,
  gal_us: 264.172052,
  gal_uk: 219.969248,
};

export function lengthToMeters(value: number, unit: LengthUnit): number {
  return value * LENGTH_TO_METER[unit];
}

export function convertFromM3(valueM3: number, targetUnit: VolumeUnit): number {
  return valueM3 * M3_TO_VOLUME_UNIT[targetUnit];
}

export function convertToM3(value: number, sourceUnit: VolumeUnit): number {
  return value / M3_TO_VOLUME_UNIT[sourceUnit];
}

export function formatNumber(value: number, maximumFractionDigits = 2): string {
  if (!Number.isFinite(value)) {
    return "0";
  }

  const abs = Math.abs(value);
  let digits = maximumFractionDigits;

  if (maximumFractionDigits === 2 && abs > 0) {
    if (abs < 0.0001) {
      digits = 6;
    } else if (abs < 0.01) {
      digits = 4;
    } else if (abs < 1) {
      digits = 3;
    }
  }

  return new Intl.NumberFormat("en", {
    maximumFractionDigits: digits,
  }).format(value);
}

export function formatVolume(value: number, unit: VolumeUnit): string {
  return `${formatNumber(value)} ${unitLabel(unit)}`;
}

export function unitLabel(unit: VolumeUnit): string {
  const labels: Record<VolumeUnit, string> = {
    m3: "m³",
    cm3: "cm³",
    mm3: "mm³",
    ft3: "ft³",
    in3: "in³",
    yd3: "yd³",
    l: "liters",
    ml: "ml",
    gal_us: "US gal",
    gal_uk: "UK gal",
  };

  return labels[unit];
}
