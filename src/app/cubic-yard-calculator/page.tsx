import type { Metadata } from "next";
import { CalculatorPage } from "@/components/CalculatorPage";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Cubic Yard Calculator for Soil, Concrete & Mulch",
  description:
    "Use this cubic yard calculator to calculate yd3 from length, width, depth, and material dimensions.",
  path: "/cubic-yard-calculator",
});

export default function Page() {
  return (
    <CalculatorPage
      scene="cubic_yards"
      seoPage="cubic_yard"
      currentPath="/cubic-yard-calculator"
      title="Cubic Yard Calculator"
      description="Enter length, width, and depth to calculate cubic yards for a measured project."
    />
  );
}
