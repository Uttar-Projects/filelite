import type { Metadata } from "next";
import { UtilityLanding } from "@/components/seo/UtilityLanding";
import { PasswordTool } from "@/components/utilities/tools";
import { utilityPages } from "@/lib/content/utility-pages";
import { pageMetadata } from "@/lib/seo/metadata";

const page = utilityPages["password-generator"];
export const metadata: Metadata = pageMetadata(page);

export default function PasswordGeneratorPage() {
  return (
    <UtilityLanding slug="password-generator">
      <PasswordTool />
    </UtilityLanding>
  );
}
