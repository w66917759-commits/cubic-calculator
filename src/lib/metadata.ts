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
  const image = {
    url: SITE.imagePath,
    width: 1200,
    height: 630,
    alt: SITE.imageAlt,
  };

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
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [SITE.imagePath],
    },
  };
}
