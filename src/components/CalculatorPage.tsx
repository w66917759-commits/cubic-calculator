import Link from "next/link";
import type { SceneType } from "@/lib/calculator/types";
import { calculatorNavItems } from "@/lib/site";
import type { SeoPageKey } from "./SeoContent";
import { CalculatorLayout } from "./CalculatorLayout";
import { HowToUsePanel } from "./HowToUsePanel";
import { SeoContent } from "./SeoContent";
import { StructuredData } from "./StructuredData";
import { createCalculatorStructuredData } from "@/lib/structured-data";

interface CalculatorPageProps {
  scene: SceneType;
  seoPage: SeoPageKey;
  currentPath: string;
  title: string;
  description: string;
}

export function CalculatorPage({ scene, seoPage, currentPath, title, description }: CalculatorPageProps) {
  const otherCalculators = calculatorNavItems.filter((item) => item.href !== currentPath);

  return (
    <main>
      <StructuredData
        data={createCalculatorStructuredData({
          title,
          description,
          path: currentPath,
        })}
      />
      <CalculatorLayout scene={scene} title={title} description={description} />
      <section
        className="calculator-links"
        id="calculator-links"
        aria-label="Related calculators"
        data-nosnippet=""
      >
        <div className="calculator-links-head">
          <p className="eyebrow">Related calculators</p>
          <h2>Choose a calculator for the measurement you need.</h2>
        </div>
        <div className="calculator-link-grid">
          {otherCalculators.map((item) => (
            <Link href={item.href} key={item.href}>
              {item.label}
            </Link>
          ))}
        </div>
      </section>
      <HowToUsePanel scene={scene} />
      <SeoContent page={seoPage} />
    </main>
  );
}
