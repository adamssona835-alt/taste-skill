import type { Metadata, Viewport } from "next";
import { Bodoni_Moda, Hanken_Grotesk } from "next/font/google";
import "@/styles/globals.css";
import { site } from "@/data/site";
import { SmoothScroll } from "@/components/SmoothScroll";
import { Nav } from "@/components/Nav";

// Bodoni: Parma, 1798. Rational, architectural contrast, and Italian.
const bodoni = Bodoni_Moda({
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["opsz"],
  variable: "--font-bodoni",
  display: "swap",
});

const hanken = Hanken_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-hanken",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "Ardesia | Architecture and interiors, Genoa",
    template: "%s | Ardesia",
  },
  description: site.description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: "Ardesia",
    locale: "en_GB",
    url: "/",
    title: "Ardesia | Architecture and interiors, Genoa",
    description: site.description,
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: "Light through slits in a concrete wall, falling across a stone floor." }],
  },
  twitter: { card: "summary_large_image", images: ["/og.jpg"] },
  robots: { index: true, follow: true },
  icons: { icon: "/icon.svg" },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#e8e7e2" },
    { media: "(prefers-color-scheme: dark)", color: "#121415" },
  ],
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: site.legalName,
  alternateName: site.name,
  url: site.url,
  description: site.description,
  email: site.email,
  telephone: site.phone,
  foundingDate: "2009",
  address: {
    "@type": "PostalAddress",
    streetAddress: site.address[0],
    postalCode: "16123",
    addressLocality: "Genova",
    addressRegion: "Liguria",
    addressCountry: "IT",
  },
  areaServed: ["Liguria", "Italy", "Mediterranean"],
  knowsAbout: ["Architecture", "Interior design", "Building restoration", "Landscape design"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${bodoni.variable} ${hanken.variable}`} suppressHydrationWarning>
      <head>
        {/* Flags JS early so pre-animation states never hide content for no-JS visitors. */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </head>
      <body>
        <a
          href="#main"
          className="sr-only-focusable fixed left-4 top-4 bg-ink px-4 py-3 text-bg"
          style={{ zIndex: 80 }}
        >
          Skip to content
        </a>
        <SmoothScroll />
        <Nav />
        {children}
        <div className="grain" aria-hidden="true" />
      </body>
    </html>
  );
}
