import type { Metadata } from "next";
import { CalculatorPage } from "@/components/CalculatorPage";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Cubic Calculator",
  description:
    "Use this cubic calculator to calculate cubic measurement for boxes, cylinders, prisms, and mixed shapes.",
  path: "/cubic-calculator",
});

export default function Page() {
  return (
    <CalculatorPage
      scene="general"
      seoPage="cubic"
      currentPath="/cubic-calculator"
      title="Cubic Calculator"
      description="Build a cubic measurement from simple shapes, combined forms, quantities, and subtractions."
    />
  );
}
