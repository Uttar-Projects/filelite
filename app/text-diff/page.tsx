import type { Metadata } from "next";
import { UtilityLanding } from "@/components/seo/UtilityLanding";
import { DiffTool } from "@/components/utilities/tools";
import { utilityPages } from "@/lib/content/utility-pages";
import { pageMetadata } from "@/lib/seo/metadata";

const page = utilityPages["text-diff"];
export const metadata: Metadata = pageMetadata(page);

export default function TextDiffPage() {
  return (
    <UtilityLanding slug="text-diff">
      <DiffTool />
    </UtilityLanding>
  );
}
