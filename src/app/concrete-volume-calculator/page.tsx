import type { Metadata } from "next";
import { CalculatorPage } from "@/components/CalculatorPage";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Concrete Volume Calculator for Slabs, Footings & Voids",
  description:
    "Use this concrete volume calculator to calculate concrete quantity from dimensions, voids, and waste.",
  path: "/concrete-volume-calculator",
});

export default function Page() {
  return (
    <CalculatorPage
      scene="concrete"
      seoPage="concrete_volume"
      currentPath="/concrete-volume-calculator"
      title="Concrete Volume Calculator"
      description="Enter concrete dimensions, subtract openings, and include waste before using the result."
    />
  );
}
