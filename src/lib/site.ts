export const SITE = {
  name: "Cubic Calculator",
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "https://cubiccalculate.com").replace(/\/$/, ""),
  description:
    "Focused volume and cubic calculators for dimensions, units, materials, rooms, tanks, soil, concrete, and freight.",
};

export const calculatorNavItems = [
  { href: "/", label: "Volume Calculator" },
  { href: "/cubic-calculator", label: "Cubic Calculator" },
  { href: "/cubic-feet-calculator", label: "Cubic Feet Calculator" },
  { href: "/cubic-yard-calculator", label: "Cubic Yard Calculator" },
  { href: "/cbm-calculator", label: "CBM Calculator" },
  { href: "/concrete-volume-calculator", label: "Concrete Volume Calculator" },
  { href: "/room-volume-calculator", label: "Room Volume Calculator" },
  { href: "/tank-volume-calculator", label: "Tank Volume Calculator" },
  { href: "/soil-volume-calculator", label: "Soil Calculator" },
];

export const toolNavItems = [{ href: "#volume-converter", label: "Converter" }];

export const utilityNavItems = [
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/privacy-policy", label: "Privacy" },
  { href: "/terms-of-use", label: "Terms" },
];

export const sitemapEntries = [
  ...calculatorNavItems,
  ...utilityNavItems,
];
