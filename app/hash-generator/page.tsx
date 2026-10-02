import type { Metadata } from "next";
import { UtilityLanding } from "@/components/seo/UtilityLanding";
import { HashTool } from "@/components/utilities/tools";
import { utilityPages } from "@/lib/content/utility-pages";
import { pageMetadata } from "@/lib/seo/metadata";

const page = utilityPages["hash-generator"];
export const metadata: Metadata = pageMetadata(page);

export default function HashGeneratorPage() {
  return (
    <UtilityLanding slug="hash-generator">
      <HashTool />
    </UtilityLanding>
  );
}
