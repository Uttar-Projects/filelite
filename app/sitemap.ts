import type { MetadataRoute } from "next";
import { toolPageList } from "@/lib/content/tool-pages";
import { utilityPageList } from "@/lib/content/utility-pages";
import { absoluteUrl } from "@/lib/seo/site";
import { seoCategories } from "@/lib/tools/categories";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const paths = [
    "/",
    "/tools",
    "/about",
    "/privacy",
    "/terms",
    "/contact",
    ...seoCategories.map((category) => category.path),
    ...toolPageList.map((page) => page.path),
    ...utilityPageList.map((page) => page.path),
  ];

  return paths.map((path) => ({
    url: absoluteUrl(path),
    lastModified: now,
    changeFrequency: path === "/" || path === "/tools" ? "weekly" : "monthly",
    priority:
      path === "/" ? 1 : path === "/tools" ? 0.9 : path === "/about" || path === "/privacy" || path === "/terms" || path === "/contact" ? 0.3 : 0.8,
  }));
}
