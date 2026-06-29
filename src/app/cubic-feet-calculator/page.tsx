import type { Metadata } from "next";
import { CalculatorPage } from "@/components/CalculatorPage";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Cubic Feet Calculator",
  description:
    "Use this cubic feet calculator to calculate ft3 from length, width, height, quantity, and shape inputs.",
  path: "/cubic-feet-calculator",
});

export default function Page() {
  return (
    <CalculatorPage
      scene="cubic_feet"
      seoPage="cubic_feet"
      currentPath="/cubic-feet-calculator"
      title="Cubic Feet Calculator"
      description="Enter dimensions in feet, inches, yards, or metric units and get a cubic feet result."
    />
  );
}
