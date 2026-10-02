import type { FaqItem } from "@/lib/seo/schema";

export function FaqList({ items }: { items: FaqItem[] }) {
  return (
    <div className="divide-y divide-line rounded-2xl border border-line bg-card">
      {items.map((item) => (
        <details key={item.question} className="group px-4 py-1">
          <summary className="cursor-pointer list-none py-3 font-semibold [&::-webkit-details-marker]:hidden">
            <span className="flex items-center justify-between gap-4">
              {item.question}
              <span aria-hidden className="text-muted group-open:rotate-45">
                +
              </span>
            </span>
          </summary>
          <p className="pb-4 text-sm leading-6 text-muted">{item.answer}</p>
        </details>
      ))}
    </div>
  );
}
