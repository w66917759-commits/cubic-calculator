import type { MetadataRoute } from "next";
import { absoluteSiteUrl, sitemapEntries } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return sitemapEntries.map((entry) => ({
    url: absoluteSiteUrl(entry.href),
    lastModified: new Date(entry.lastModified),
  }));
}
