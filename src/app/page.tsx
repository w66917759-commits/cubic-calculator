import type { Metadata } from "next";
import { CalculatorPage } from "@/components/CalculatorPage";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Volume Calculator",
  description:
    "Use this volume calculator to calculate volume from dimensions, shapes, units, and project settings.",
  path: "/",
});

export default function Home() {
  return (
    <CalculatorPage
      scene="general"
      seoPage="volume"
      currentPath="/"
      title="Volume Calculator"
      description="Enter dimensions, choose the shape, and calculate volume with unit conversions in one workspace."
    />
  );
}
