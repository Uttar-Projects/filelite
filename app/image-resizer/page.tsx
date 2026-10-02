import type { Metadata } from "next";
import { ToolLanding } from "@/components/seo/ToolLanding";
import { toolPages } from "@/lib/content/tool-pages";
import { pageMetadata } from "@/lib/seo/metadata";

const page = toolPages["image-resizer"];
export const metadata: Metadata = pageMetadata(page);

export default function ImageResizerPage() {
  return <ToolLanding page={page} />;
}
