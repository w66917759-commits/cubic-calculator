"use client";

import { usePathname, useRouter } from "next/navigation";
import { calculatorNavItems } from "@/lib/site";

interface CalculatorNavSelectProps {
  className?: string;
  label?: string;
}

function getActiveCalculator(pathname: string) {
  return calculatorNavItems.find((item) => pathname === item.href)?.href ?? "";
}

export function CalculatorNavSelect({ className = "", label = "Calculator" }: CalculatorNavSelectProps) {
  const pathname = usePathname();
  const router = useRouter();
  const activeHref = getActiveCalculator(pathname);

  return (
    <label className={`calculator-nav-select ${className}`.trim()}>
      <span>{label}</span>
      <select
        aria-label="Choose calculator"
        value={activeHref}
        onChange={(event) => {
          if (event.target.value) {
            router.push(event.target.value);
          }
        }}
      >
        {!activeHref ? <option value="">Calculators</option> : null}
        {calculatorNavItems.map((item) => (
          <option value={item.href} key={item.href}>
            {item.label}
          </option>
        ))}
      </select>
    </label>
  );
}
