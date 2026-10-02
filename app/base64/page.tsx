import type { Metadata } from "next";
import { UtilityLanding } from "@/components/seo/UtilityLanding";
import { Base64Tool } from "@/components/utilities/tools";
import { utilityPages } from "@/lib/content/utility-pages";
import { pageMetadata } from "@/lib/seo/metadata";

const page = utilityPages.base64;
export const metadata: Metadata = pageMetadata(page);

export default function Base64Page() {
  return (
    <UtilityLanding slug="base64">
      <Base64Tool />
    </UtilityLanding>
  );
}
