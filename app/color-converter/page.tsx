import type { Metadata } from "next";
import { UtilityLanding } from "@/components/seo/UtilityLanding";
import { ColorTool } from "@/components/utilities/tools";
import { utilityPages } from "@/lib/content/utility-pages";
import { pageMetadata } from "@/lib/seo/metadata";

const page = utilityPages["color-converter"];
export const metadata: Metadata = pageMetadata(page);

export default function ColorConverterPage() {
  return (
    <UtilityLanding slug="color-converter">
      <ColorTool />
    </UtilityLanding>
  );
}
