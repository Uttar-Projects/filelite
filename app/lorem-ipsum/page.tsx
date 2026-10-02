import type { Metadata } from "next";
import { UtilityLanding } from "@/components/seo/UtilityLanding";
import { LoremTool } from "@/components/utilities/tools";
import { utilityPages } from "@/lib/content/utility-pages";
import { pageMetadata } from "@/lib/seo/metadata";

const page = utilityPages["lorem-ipsum"];
export const metadata: Metadata = pageMetadata(page);

export default function LoremIpsumPage() {
  return (
    <UtilityLanding slug="lorem-ipsum">
      <LoremTool />
    </UtilityLanding>
  );
}
