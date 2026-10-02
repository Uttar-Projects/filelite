"use client";

import { useState } from "react";
import { buttonClass } from "@/components/ui/Button";
import { siteConfig } from "@/lib/seo/site";

const fieldClass = "mt-2 w-full rounded-xl border border-line bg-card px-3 py-3 text-base text-ink";

export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [notice, setNotice] = useState<string | null>(null);
  const contact = process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim();

  function draft() {
    return `Name: ${name}\nEmail: ${email}\n\n${message}`;
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!message.trim()) {
      setNotice("Write a message before sending.");
      return;
    }
    if (contact) {
      const href = `mailto:${contact}?subject=${encodeURIComponent(`${siteConfig.name} contact`)}&body=${encodeURIComponent(draft())}`;
      window.location.href = href;
      setNotice("Your email app should open with this message.");
      return;
    }
    try {
      await navigator.clipboard.writeText(draft());
      setNotice("No contact email is configured. The message was copied so you can paste it into your own email.");
    } catch {
      setNotice("No contact email is configured, and the message could not be copied. Select the text and copy it manually.");
    }
  }

  return (
    <form onSubmit={onSubmit} className="mt-6 space-y-4">
      <div>
        <label htmlFor="contact-name" className="text-sm font-semibold">
          Name
        </label>
        <input id="contact-name" className={fieldClass} value={name} onChange={(event) => setName(event.target.value)} autoComplete="name" />
      </div>
      <div>
        <label htmlFor="contact-email" className="text-sm font-semibold">
          Email
        </label>
        <input id="contact-email" type="email" className={fieldClass} value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" />
      </div>
      <div>
        <label htmlFor="contact-message" className="text-sm font-semibold">
          Message
        </label>
        <textarea id="contact-message" className={`${fieldClass} min-h-32`} value={message} onChange={(event) => setMessage(event.target.value)} required />
      </div>
      <button type="submit" className={buttonClass("primary")}>
        {contact ? "Open email draft" : "Copy message"}
      </button>
      {notice ? <p className="text-sm text-muted">{notice}</p> : null}
    </form>
  );
}
