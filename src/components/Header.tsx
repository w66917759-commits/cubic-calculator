"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Box } from "lucide-react";
import { calculatorNavItems, toolNavItems } from "@/lib/site";
import { CalculatorNavSelect } from "./CalculatorNavSelect";

function isCalculatorPath(pathname: string) {
  return pathname === "/" || calculatorNavItems.some((item) => item.href === pathname);
}

export function Header() {
  const pathname = usePathname();
  const showToolNav = isCalculatorPath(pathname);

  return (
    <header className="site-header">
      <Link href="/" className="brand" aria-label="Cubic Calculator home">
        <span className="brand-mark">
          <Box size={17} aria-hidden />
        </span>
        <span className="brand-name">Cubic Calculator</span>
      </Link>
      <nav className="site-nav" aria-label="Calculators" data-nosnippet="">
        {showToolNav
          ? toolNavItems.map((item) => (
              <Link className="tool-link" href={item.href} key={item.href}>
                {item.label}
              </Link>
            ))
          : null}
        <CalculatorNavSelect />
      </nav>
    </header>
  );
}
