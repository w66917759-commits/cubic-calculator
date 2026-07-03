import type { Metadata } from "next";
import Script from "next/script";
import { BottomNavigation } from "@/components/BottomNavigation";
import { Header } from "@/components/Header";
import { StructuredData } from "@/components/StructuredData";
import { SITE } from "@/lib/site";
import { createSiteStructuredData } from "@/lib/structured-data";
import "../styles/globals.css";

const GA_MEASUREMENT_ID = "G-XD0ZHRY2DQ";
const previewImage = {
  url: SITE.imagePath,
  width: 1200,
  height: 630,
  alt: SITE.imageAlt,
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  applicationName: SITE.name,
  title: {
    default: "Volume Calculator for Boxes, Rooms & Materials",
    template: "%s | Cubic Calculator",
  },
  description: SITE.description,
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
  },
  openGraph: {
    title: "Volume Calculator for Boxes, Rooms & Materials",
    description: SITE.description,
    url: "/",
    siteName: SITE.name,
    type: "website",
    images: [previewImage],
  },
  twitter: {
    card: "summary_large_image",
    title: "Volume Calculator for Boxes, Rooms & Materials",
    description: SITE.description,
    images: [SITE.imagePath],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', '${GA_MEASUREMENT_ID}');
          `}
        </Script>
        <StructuredData data={createSiteStructuredData()} />
        <Header />
        {children}
        <BottomNavigation />
      </body>
    </html>
  );
}
