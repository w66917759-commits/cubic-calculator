import type { Metadata } from "next";
import { BottomNavigation } from "@/components/BottomNavigation";
import { Header } from "@/components/Header";
import { SITE } from "@/lib/site";
import "../styles/globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  applicationName: SITE.name,
  title: {
    default: "Volume Calculator",
    template: "%s | Cubic Calculator",
  },
  description: SITE.description,
  openGraph: {
    title: "Volume Calculator",
    description: SITE.description,
    url: "/",
    siteName: SITE.name,
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Volume Calculator",
    description: SITE.description,
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
        <Header />
        {children}
        <BottomNavigation />
      </body>
    </html>
  );
}
