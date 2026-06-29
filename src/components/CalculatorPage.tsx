import Link from "next/link";
import type { SceneType } from "@/lib/calculator/types";
import { calculatorNavItems } from "@/lib/site";
import type { SeoPageKey } from "./SeoContent";
import { CalculatorLayout } from "./CalculatorLayout";
import { HowToUsePanel } from "./HowToUsePanel";
import { SeoContent } from "./SeoContent";

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
      <CalculatorLayout scene={scene} title={title} description={description} />
      <section className="calculator-links" id="calculator-links" aria-label="Related calculators">
        <div className="calculator-links-head">
          <p className="eyebrow">Related calculators</p>
          <h2>Open a focused calculator when the main keyword changes.</h2>
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
