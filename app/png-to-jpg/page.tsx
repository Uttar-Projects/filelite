import type { Metadata } from "next";
import { ToolLanding } from "@/components/seo/ToolLanding";
import { toolPages } from "@/lib/content/tool-pages";
import { pageMetadata } from "@/lib/seo/metadata";

const page = toolPages["png-to-jpg"];
export const metadata: Metadata = pageMetadata(page);

export default function PngToJpgPage() {
  return <ToolLanding page={page} />;
}
