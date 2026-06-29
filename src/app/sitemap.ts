import type { MetadataRoute } from "next";
import { SITE, sitemapEntries } from "@/lib/site";

function absoluteUrl(path: string) {
  return path === "/" ? SITE.url : `${SITE.url}${path}`;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return sitemapEntries.map((entry) => ({
    url: absoluteUrl(entry.href),
    lastModified,
    changeFrequency: entry.href === "/" ? "weekly" : "monthly",
    priority: entry.href === "/" ? 1 : entry.href.includes("calculator") ? 0.9 : 0.45,
  }));
}
