import type { Metadata } from "next";
import { CalculatorPage } from "@/components/CalculatorPage";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Room Volume Calculator",
  description:
    "Use this room volume calculator to calculate room volume from length, width, height, and layout dimensions.",
  path: "/room-volume-calculator",
});

export default function Page() {
  return (
    <CalculatorPage
      scene="room"
      seoPage="room_volume"
      currentPath="/room-volume-calculator"
      title="Room Volume Calculator"
      description="Enter room dimensions and calculate room volume for a simple or shaped space."
    />
  );
}
