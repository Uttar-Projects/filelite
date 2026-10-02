import type { Metadata } from "next";
import { UtilityLanding } from "@/components/seo/UtilityLanding";
import { UnitTool } from "@/components/utilities/tools";
import { utilityPages } from "@/lib/content/utility-pages";
import { pageMetadata } from "@/lib/seo/metadata";

const page = utilityPages["unit-converter"];
export const metadata: Metadata = pageMetadata(page);

export default function UnitConverterPage() {
  return (
    <UtilityLanding slug="unit-converter">
      <UnitTool />
    </UtilityLanding>
  );
}
