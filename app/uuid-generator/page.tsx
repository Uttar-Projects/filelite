import type { Metadata } from "next";
import { UtilityLanding } from "@/components/seo/UtilityLanding";
import { UuidTool } from "@/components/utilities/tools";
import { utilityPages } from "@/lib/content/utility-pages";
import { pageMetadata } from "@/lib/seo/metadata";

const page = utilityPages["uuid-generator"];
export const metadata: Metadata = pageMetadata(page);

export default function UuidGeneratorPage() {
  return (
    <UtilityLanding slug="uuid-generator">
      <UuidTool />
    </UtilityLanding>
  );
}
