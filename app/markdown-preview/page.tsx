import type { Metadata } from "next";
import { UtilityLanding } from "@/components/seo/UtilityLanding";
import { MarkdownTool } from "@/components/utilities/tools";
import { utilityPages } from "@/lib/content/utility-pages";
import { pageMetadata } from "@/lib/seo/metadata";

const page = utilityPages["markdown-preview"];
export const metadata: Metadata = pageMetadata(page);

export default function MarkdownPreviewPage() {
  return (
    <UtilityLanding slug="markdown-preview">
      <MarkdownTool />
    </UtilityLanding>
  );
}
