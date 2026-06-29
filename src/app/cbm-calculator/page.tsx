import type { Metadata } from "next";
import { CalculatorPage } from "@/components/CalculatorPage";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "CBM Calculator",
  description:
    "Use this CBM calculator to calculate cubic meter freight volume from carton dimensions and quantity.",
  path: "/cbm-calculator",
});

export default function Page() {
  return (
    <CalculatorPage
      scene="shipping"
      seoPage="cbm"
      currentPath="/cbm-calculator"
      title="CBM Calculator"
      description="Enter carton dimensions and quantity to calculate CBM for a shipment."
    />
  );
}
