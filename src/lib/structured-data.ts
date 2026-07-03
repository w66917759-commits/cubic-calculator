import { absoluteSiteUrl, SITE } from "./site";

interface CalculatorStructuredDataInput {
  title: string;
  description: string;
  path: string;
}

const imageUrl = absoluteSiteUrl(SITE.imagePath);

export function createSiteStructuredData() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${SITE.url}/#website`,
        name: SITE.name,
        url: SITE.url,
        description: SITE.description,
        inLanguage: "en",
      },
      {
        "@type": "Organization",
        "@id": `${SITE.url}/#organization`,
        name: SITE.name,
        url: SITE.url,
        logo: {
          "@type": "ImageObject",
          url: imageUrl,
          width: 1200,
          height: 630,
        },
      },
    ],
  };
}

export function createCalculatorStructuredData({
  title,
  description,
  path,
}: CalculatorStructuredDataInput) {
  const url = absoluteSiteUrl(path);
  const softwareId = `${url}#calculator`;
  const breadcrumbItems = path === "/"
    ? [
        {
          "@type": "ListItem",
          position: 1,
          name: title,
          item: url,
        },
      ]
    : [
        {
          "@type": "ListItem",
          position: 1,
          name: "Volume Calculator",
          item: SITE.url,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: title,
          item: url,
        },
      ];

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${url}#webpage`,
        url,
        name: title,
        description,
        isPartOf: {
          "@id": `${SITE.url}/#website`,
        },
        primaryImageOfPage: {
          "@type": "ImageObject",
          url: imageUrl,
          width: 1200,
          height: 630,
        },
        mainEntity: {
          "@id": softwareId,
        },
        breadcrumb: {
          "@id": `${url}#breadcrumb`,
        },
        inLanguage: "en",
      },
      {
        "@type": "SoftwareApplication",
        "@id": softwareId,
        name: title,
        url,
        description,
        applicationCategory: "UtilitiesApplication",
        operatingSystem: "Any",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
        },
        featureList: [
          "Volume calculation from dimensions",
          "Unit conversion",
          "Shape-specific formulas",
          "Material, waste, weight, and cost estimates",
        ],
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${url}#breadcrumb`,
        itemListElement: breadcrumbItems,
      },
    ],
  };
}
