export function Mark({ className = "size-7" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" className={`shrink-0 ${className}`}>
      <rect width="32" height="32" rx="9" fill="#ff6a00" />
      <path
        d="M8.5 21.5 14 9.5h4L24.5 21.5h-3.4l-1.2-2.8h-6.8l-1.2 2.8H8.5Zm5.2-5.2h4.6L16 12.2h0l-2.3 4.1Z"
        fill="#140800"
      />
    </svg>
  );
}
