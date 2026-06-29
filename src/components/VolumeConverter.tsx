"use client";

import { useMemo, useState } from "react";
import { ArrowRightLeft } from "lucide-react";
import { VOLUME_UNITS } from "@/lib/calculator/constants";
import { convertFromM3, convertToM3, formatNumber, formatVolume, unitLabel } from "@/lib/calculator/units";
import type { VolumeUnit } from "@/lib/calculator/types";

const QUICK_UNITS: VolumeUnit[] = ["m3", "ft3", "yd3", "l", "gal_us"];

export function VolumeConverter() {
  const [value, setValue] = useState("1");
  const [fromUnit, setFromUnit] = useState<VolumeUnit>("m3");
  const [toUnit, setToUnit] = useState<VolumeUnit>("ft3");

  const numericValue = Number(value);
  const isValid = value.trim() !== "" && Number.isFinite(numericValue) && numericValue >= 0;

  const baseVolumeM3 = isValid ? convertToM3(numericValue, fromUnit) : 0;
  const convertedValue = isValid ? convertFromM3(baseVolumeM3, toUnit) : 0;

  const quickConversions = useMemo(
    () =>
      QUICK_UNITS.filter((unit) => unit !== fromUnit).map((unit) => ({
        unit,
        value: convertFromM3(baseVolumeM3, unit),
      })),
    [baseVolumeM3, fromUnit],
  );

  function swapUnits() {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
    setValue(isValid ? formatNumber(convertedValue, 6).replace(/,/g, "") : value);
  }

  return (
    <section id="volume-converter" className="volume-converter" aria-labelledby="volume-converter-title">
      <div className="converter-head">
        <div>
          <p className="eyebrow">Unit converter</p>
          <h2 id="volume-converter-title">Cubic volume unit converter</h2>
        </div>
        <button className="ghost-button converter-swap" type="button" onClick={swapUnits}>
          <ArrowRightLeft size={15} aria-hidden />
          Swap
        </button>
      </div>

      <div className="converter-grid">
        <label className="field">
          <span>Volume</span>
          <input
            aria-invalid={!isValid}
            min="0"
            step="any"
            type="number"
            value={value}
            onChange={(event) => setValue(event.target.value)}
          />
          {!isValid ? <small>Enter a volume greater than or equal to 0.</small> : null}
        </label>

        <label className="field">
          <span>From</span>
          <select value={fromUnit} onChange={(event) => setFromUnit(event.target.value as VolumeUnit)}>
            {VOLUME_UNITS.map((unit) => (
              <option value={unit.id} key={unit.id}>
                {unit.label}
              </option>
            ))}
          </select>
        </label>

        <label className="field">
          <span>To</span>
          <select value={toUnit} onChange={(event) => setToUnit(event.target.value as VolumeUnit)}>
            {VOLUME_UNITS.map((unit) => (
              <option value={unit.id} key={unit.id}>
                {unit.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="converter-result" aria-live="polite">
        <span>{isValid ? formatVolume(numericValue, fromUnit) : "Invalid volume"}</span>
        <strong>{isValid ? formatVolume(convertedValue, toUnit) : `0 ${unitLabel(toUnit)}`}</strong>
      </div>

      <div className="converter-list" aria-label="Common conversions">
        {quickConversions.map((conversion) => (
          <div key={conversion.unit}>
            <span>{unitLabel(conversion.unit)}</span>
            <strong>{isValid ? formatVolume(conversion.value, conversion.unit) : `0 ${unitLabel(conversion.unit)}`}</strong>
          </div>
        ))}
      </div>
    </section>
  );
}
