import type { Metadata } from "next";
import { ToolLanding } from "@/components/seo/ToolLanding";
import { toolPages } from "@/lib/content/tool-pages";
import { pageMetadata } from "@/lib/seo/metadata";

const page = toolPages["compress-png"];
export const metadata: Metadata = pageMetadata(page);

export default function CompressPngPage() {
  return <ToolLanding page={page} />;
}
