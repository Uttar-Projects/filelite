import type { Metadata } from "next";
import { ContactForm } from "@/components/contact/ContactForm";
import { Container } from "@/components/ui/Container";
import { pageMetadata } from "@/lib/seo/metadata";
import { siteConfig } from "@/lib/seo/site";

export const metadata: Metadata = pageMetadata({
  title: `Contact ${siteConfig.name}`,
  description: `Contact ${siteConfig.name}. The form prepares an email on your device and does not post your message to a server.`,
  path: "/contact",
});

export default function ContactPage() {
  return (
    <Container className="max-w-xl py-12">
      <h1 className="text-4xl">Contact</h1>
      <p className="mt-4 text-sm leading-7 text-muted">
        This form stays in your browser. It opens an email draft when a contact address is configured, and otherwise
        copies the message so you can send it yourself.
      </p>
      <ContactForm />
    </Container>
  );
}
