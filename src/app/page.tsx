import type { Metadata } from "next";
import { CalculatorPage } from "@/components/CalculatorPage";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Volume Calculator for Boxes, Rooms & Materials",
  description:
    "Calculate volume for boxes, rooms, tanks, soil, concrete, freight, and mixed shapes with unit conversions.",
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
