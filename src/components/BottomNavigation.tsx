"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowRightLeft,
  Box,
  FileText,
  Mail,
  Shield,
} from "lucide-react";
import { calculatorNavItems, toolNavItems, utilityNavItems } from "@/lib/site";
import { CalculatorNavSelect } from "./CalculatorNavSelect";

const utilityIcons = {
  "/about": Box,
  "/contact": Mail,
  "/privacy-policy": Shield,
  "/terms-of-use": FileText,
};

const toolIcons = {
  "#volume-converter": ArrowRightLeft,
};

function isCalculatorPath(pathname: string) {
  return pathname === "/" || calculatorNavItems.some((item) => item.href === pathname);
}

export function BottomNavigation() {
  const pathname = usePathname();
  const showToolNav = isCalculatorPath(pathname);

  return (
    <footer className="bottom-navigation" data-nosnippet="">
      <nav className="bottom-navigation-inner" aria-label="Bottom navigation">
        <div className="bottom-navigation-group" aria-label="Calculators">
          {showToolNav
            ? toolNavItems.map((item) => {
                const Icon = toolIcons[item.href as keyof typeof toolIcons] ?? ArrowRightLeft;

                return (
                  <Link href={item.href} key={item.href}>
                    <Icon size={16} aria-hidden />
                    <span>{item.label}</span>
                  </Link>
                );
              })
            : (
              <Link href="/cubic-calculator">
                <ArrowRightLeft size={16} aria-hidden />
                <span>Tool</span>
              </Link>
            )}
          <CalculatorNavSelect className="bottom-calculator-select" />
        </div>

        <span className="bottom-navigation-divider" aria-hidden />

        <div className="bottom-navigation-group utility-links" aria-label="Site information">
          {utilityNavItems.map((item) => {
            const Icon = utilityIcons[item.href as keyof typeof utilityIcons] ?? FileText;
            const isActive = pathname === item.href;

            return (
              <Link
                href={item.href}
                key={item.href}
                className={isActive ? "active" : undefined}
                aria-current={isActive ? "page" : undefined}
              >
                <Icon size={16} aria-hidden />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </footer>
  );
}
