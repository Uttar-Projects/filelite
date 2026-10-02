import type { Metadata } from "next";
import { UtilityLanding } from "@/components/seo/UtilityLanding";
import { SlugTool } from "@/components/utilities/tools";
import { utilityPages } from "@/lib/content/utility-pages";
import { pageMetadata } from "@/lib/seo/metadata";

const page = utilityPages["slug-generator"];
export const metadata: Metadata = pageMetadata(page);

export default function SlugGeneratorPage() {
  return (
    <UtilityLanding slug="slug-generator">
      <SlugTool />
    </UtilityLanding>
  );
}
