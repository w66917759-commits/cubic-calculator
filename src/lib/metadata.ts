import type { Metadata } from "next";
import { SITE } from "./site";

interface PageMetadataInput {
  title: string;
  description: string;
  path: string;
}

export function createPageMetadata({
  title,
  description,
  path,
}: PageMetadataInput): Metadata {
  return {
    title,
    description,
    alternates: {
      canonical: path,
    },
    openGraph: {
      title,
      description,
      url: path,
      siteName: SITE.name,
      type: "website",
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  };
}
