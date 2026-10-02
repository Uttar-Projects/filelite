import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { pageMetadata } from "@/lib/seo/metadata";
import { siteConfig } from "@/lib/seo/site";
import { availableTools } from "@/lib/tools/catalog";

export const dynamic = "force-dynamic";

export const metadata: Metadata = pageMetadata({
  title: "Random tool",
  description: `Open a random free browser tool on ${siteConfig.name}.`,
  path: "/random",
  index: false,
});

export default function RandomToolPage() {
  const tools = availableTools();
  const pick = tools[Math.floor(Math.random() * tools.length)];
  redirect(pick?.href ?? "/tools");
}
