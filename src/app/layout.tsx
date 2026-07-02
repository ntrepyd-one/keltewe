import type { Metadata, Viewport } from "next";
import ErrorBoundary from '@/components/ErrorBoundary';
import "./globals.css";

const SITE_URL = "https://keltewe.com";
const SITE_NAME = "KELTEWE";
const SITE_TITLE = "KELTEWE — Geospatial Intelligence Platform";
const SITE_DESCRIPTION = "Keltewe is a geospatial intelligence platform for monitoring events, infrastructure, threats, and open-source signals in one operational view.";

export const viewport: Viewport = {
  themeColor: "#D4AF37",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  colorScheme: "dark",
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: "%s | KELTEWE",
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "OSINT tools", "open source intelligence", "intelligence platform",
    "global intelligence", "geospatial intelligence", "GEOINT",
    "real-time tracking", "intelligence dashboard",
    "flight tracker", "aircraft tracking", "satellite tracking",
    "CCTV cameras live", "earthquake monitor", "wildfire tracker",
    "weather radar", "cyber threats dashboard", "space weather",
    "Keltewe", "keltewe.com"
  ],
  authors: [{ name: "Keltewe", url: SITE_URL }],
  creator: "Keltewe",
  publisher: "Keltewe",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/keltewe_icon_outline_neg.png", type: "image/png", sizes: "32x32" },
      { url: "/favicon.ico", type: "image/x-icon" },
    ],
    apple: [
      { url: "/keltewe_icon_outline_neg.png", sizes: "180x180" },
    ],
    shortcut: "/favicon.ico",
    other: [
      {
        rel: "apple-touch-icon-precomposed",
        url: "/keltewe_icon_outline_neg.png",
      },
    ],
  },
  manifest: "/site.webmanifest",
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    title: "KELTEWE — Geospatial Intelligence Platform",
    description: SITE_DESCRIPTION,
    type: "website",
    siteName: SITE_NAME,
    locale: "en_US",
    url: SITE_URL,
    images: [
      {
        url: `${SITE_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "KELTEWE — Geospatial Intelligence Platform",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "KELTEWE — Geospatial Intelligence Platform",
    description: SITE_DESCRIPTION,
    images: [`${SITE_URL}/og-image.png`],
  },
  category: "technology",
  classification: "Intelligence & Security",
  other: {
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
    "apple-mobile-web-app-title": "KELTEWE",
    "mobile-web-app-capable": "yes",
    "msapplication-TileColor": "#06060C",
    "msapplication-config": "none",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "KELTEWE",
  alternateName: ["KELTEWE"],
  url: SITE_URL,
  description: SITE_DESCRIPTION,
  applicationCategory: "SecurityApplication",
  operatingSystem: "Web",
  browserRequirements: "Requires a modern web browser",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
    availability: "https://schema.org/InStock",
  },
  featureList: [
    "Real-time intelligence monitoring",
    "Flight tracking",
    "Satellite tracking",
    "CCTV monitoring",
    "Earthquake monitoring",
    "Wildfire detection",
    "Weather monitoring",
    "Cyber threat intelligence",
    "Interactive geospatial interface",
    "Operational intelligence view",
  ],
  screenshot: `${SITE_URL}/og-image.png`,
  author: {
    "@type": "Organization",
    name: "Keltewe",
    url: SITE_URL,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" dir="ltr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" type="image/png" sizes="32x32" href="/keltewe_icon_outline_neg.png" />
        <link rel="apple-touch-icon" href="/keltewe_icon_outline_neg.png" />
        <link rel="canonical" href={SITE_URL} />
        
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="antialiased">
        <ErrorBoundary name="KELTEWE Core">
          {children}
        </ErrorBoundary>
      </body>
    </html>
  );
}
