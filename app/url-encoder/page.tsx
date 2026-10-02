import type { Metadata } from "next";
import { UtilityLanding } from "@/components/seo/UtilityLanding";
import { UrlTool } from "@/components/utilities/tools";
import { utilityPages } from "@/lib/content/utility-pages";
import { pageMetadata } from "@/lib/seo/metadata";

const page = utilityPages["url-encoder"];
export const metadata: Metadata = pageMetadata(page);

export default function UrlEncoderPage() {
  return (
    <UtilityLanding slug="url-encoder">
      <UrlTool />
    </UtilityLanding>
  );
}
