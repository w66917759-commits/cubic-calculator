import type { Metadata } from "next";
import Link from "next/link";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "About",
  description:
    "Learn about Cubic Calculator, a practical volume calculator for rooms, concrete, tanks, shipping cargo, soil, and mixed 3D projects.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <main className="utility-page">
      <section className="utility-card">
        <p className="eyebrow">About</p>
        <h1>About Cubic Calculator</h1>
        <p>
          Cubic Calculator helps people estimate volume quickly for real-world projects, from simple boxes
          and rooms to concrete pours, tanks, shipping cargo, soil, mulch, and combined shapes.
        </p>
        <p>
          The calculator converts dimensions into consistent units, supports add and subtract components,
          and shows formulas so estimates are easier to review before purchasing, planning, or quoting.
        </p>
        <Link className="solid-button utility-action" href="/cubic-calculator">
          Open calculator
        </Link>
      </section>
    </main>
  );
}
