import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/seo/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.name,
    short_name: siteConfig.name,
    description: siteConfig.tagline,
    start_url: "/",
    display: "standalone",
    background_color: "#050505",
    theme_color: "#ff6a00",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
