import type { Metadata } from "next";
import { CategoryLanding } from "@/components/seo/CategoryLanding";
import { pageMetadata } from "@/lib/seo/metadata";
import { categoryById } from "@/lib/tools/categories";

const page = categoryById("developer")!;
export const metadata: Metadata = pageMetadata(page);

export default function DeveloperToolsPage() {
  return <CategoryLanding categoryId="developer" />;
}
