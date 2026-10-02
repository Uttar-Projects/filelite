import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { SiteShell } from "@/components/layout/SiteShell";
import { JsonLd } from "@/components/seo/JsonLd";
import { organizationSchema, websiteSchema } from "@/lib/seo/schema";
import { siteConfig } from "@/lib/seo/site";
import { THEME_STORAGE_KEY } from "@/lib/theme";
import "./globals.css";

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const themeScript = `(function(){try{var key=${JSON.stringify(THEME_STORAGE_KEY)};var stored=localStorage.getItem(key);var theme=stored==="light"||stored==="dark"?stored:"dark";var root=document.documentElement;root.classList.toggle("dark",theme==="dark");root.style.colorScheme=theme;}catch(e){}})();`;

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.title,
    template: `%s · ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  authors: [{ name: siteConfig.name }],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  keywords: siteConfig.keywords,
  category: "utilities",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    siteName: siteConfig.name,
    title: siteConfig.title,
    description: siteConfig.description,
    locale: "en_US",
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.description,
  },
  ...(siteConfig.verification ? { verification: siteConfig.verification } : {}),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} dark h-full`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="flex min-h-full flex-col antialiased">
        <JsonLd data={organizationSchema()} />
        <JsonLd data={websiteSchema()} />
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
