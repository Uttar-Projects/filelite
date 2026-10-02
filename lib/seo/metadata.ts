import type { Metadata } from "next";
import { siteConfig } from "@/lib/seo/site";

export function pageMetadata(page: {
  title: string;
  description: string;
  path: string;
  index?: boolean;
}): Metadata {
  const index = page.index !== false;
  return {
    title: { absolute: page.title },
    description: page.description,
    alternates: { canonical: page.path },
    robots: {
      index,
      follow: index,
      googleBot: {
        index,
        follow: index,
      },
    },
    openGraph: {
      title: page.title,
      description: page.description,
      url: page.path,
      siteName: siteConfig.name,
      type: "website",
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: page.title,
      description: page.description,
    },
  };
}
