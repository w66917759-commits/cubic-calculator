import type { Metadata } from "next";
import { CalculatorPage } from "@/components/CalculatorPage";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Soil Calculator for Garden Beds, Planters & Mulch",
  description:
    "Use this soil calculator to calculate soil quantity from bed, planter, trench, or mound dimensions.",
  path: "/soil-volume-calculator",
});

export default function Page() {
  return (
    <CalculatorPage
      scene="soil"
      seoPage="soil"
      currentPath="/soil-volume-calculator"
      title="Soil Calculator"
      description="Enter soil area and depth to calculate the amount of soil for a measured space."
    />
  );
}
