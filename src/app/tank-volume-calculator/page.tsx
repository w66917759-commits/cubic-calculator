import type { Metadata } from "next";
import { CalculatorPage } from "@/components/CalculatorPage";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Tank Volume Calculator for Cylinders & Liquid Capacity",
  description:
    "Use this tank volume calculator to calculate full tank volume from vessel dimensions and shape.",
  path: "/tank-volume-calculator",
});

export default function Page() {
  return (
    <CalculatorPage
      scene="tank"
      seoPage="tank_volume"
      currentPath="/tank-volume-calculator"
      title="Tank Volume Calculator"
      description="Enter tank dimensions and calculate full tank volume with liquid unit conversions."
    />
  );
}
