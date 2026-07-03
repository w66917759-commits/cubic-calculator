export const SITE = {
  name: "Cubic Calculator",
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "https://cubiccalculate.com").replace(/\/$/, ""),
  description:
    "Focused volume and cubic calculators for dimensions, units, materials, rooms, tanks, soil, concrete, and freight.",
  imagePath: "/site-preview.png",
  imageAlt: "Cubic Calculator workspace with volume, unit, material, and freight calculators.",
};

export function absoluteSiteUrl(path: string) {
  return path === "/" ? SITE.url : `${SITE.url}${path}`;
}

export const calculatorNavItems = [
  { href: "/", label: "Volume Calculator", lastModified: "2026-07-02" },
  { href: "/cubic-calculator", label: "Cubic Calculator", lastModified: "2026-07-02" },
  { href: "/cubic-feet-calculator", label: "Cubic Feet Calculator", lastModified: "2026-07-02" },
  { href: "/cubic-yard-calculator", label: "Cubic Yard Calculator", lastModified: "2026-07-02" },
  { href: "/cbm-calculator", label: "CBM Calculator", lastModified: "2026-07-02" },
  { href: "/concrete-volume-calculator", label: "Concrete Volume Calculator", lastModified: "2026-07-02" },
  { href: "/room-volume-calculator", label: "Room Volume Calculator", lastModified: "2026-07-02" },
  { href: "/tank-volume-calculator", label: "Tank Volume Calculator", lastModified: "2026-07-02" },
  { href: "/soil-volume-calculator", label: "Soil Calculator", lastModified: "2026-07-02" },
];

export const toolNavItems = [{ href: "#volume-converter", label: "Converter" }];

export const utilityNavItems = [
  { href: "/about", label: "About", lastModified: "2026-06-28" },
  { href: "/contact", label: "Contact", lastModified: "2026-06-28" },
  { href: "/privacy-policy", label: "Privacy", lastModified: "2026-06-28" },
  { href: "/terms-of-use", label: "Terms", lastModified: "2026-06-28" },
];

export const sitemapEntries = [
  ...calculatorNavItems,
  ...utilityNavItems,
];
