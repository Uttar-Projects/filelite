import { seoCategories } from "@/lib/tools/categories";

export const primaryNav = [
  { href: "/tools", label: "Dashboard" },
  { href: "/", label: "Compressor" },
  { href: "/tools#explore", label: "All Tools" },
  ...seoCategories.map((category) => ({
    href: category.path,
    label: category.navLabel,
  })),
] as const;

export const resourceLinks = [
  { href: "/about", label: "About" },
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
  { href: "/contact", label: "Contact" },
] as const;
