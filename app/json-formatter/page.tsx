import type { Metadata } from "next";
import { UtilityLanding } from "@/components/seo/UtilityLanding";
import { JsonTool } from "@/components/utilities/tools";
import { utilityPages } from "@/lib/content/utility-pages";
import { pageMetadata } from "@/lib/seo/metadata";

const page = utilityPages["json-formatter"];
export const metadata: Metadata = pageMetadata(page);

export default function JsonFormatterPage() {
  return (
    <UtilityLanding slug="json-formatter">
      <JsonTool />
    </UtilityLanding>
  );
}
