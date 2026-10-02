import type { Metadata } from "next";
import { UtilityLanding } from "@/components/seo/UtilityLanding";
import { CaseConverterTool } from "@/components/utilities/tools";
import { utilityPages } from "@/lib/content/utility-pages";
import { pageMetadata } from "@/lib/seo/metadata";

const page = utilityPages["case-converter"];
export const metadata: Metadata = pageMetadata(page);

export default function CaseConverterPage() {
  return (
    <UtilityLanding slug="case-converter">
      <CaseConverterTool />
    </UtilityLanding>
  );
}
