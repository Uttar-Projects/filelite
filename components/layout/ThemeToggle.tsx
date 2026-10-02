"use client";

import { useEffect } from "react";
import { THEME_STORAGE_KEY as STORAGE_KEY } from "@/lib/theme";

function applyTheme(theme: "light" | "dark") {
  document.documentElement.classList.toggle("dark", theme === "dark");
  document.documentElement.style.colorScheme = theme;
}

export function ThemeToggle({ compact = false }: { compact?: boolean }) {
  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === "light" || stored === "dark") return;
      applyTheme("dark");
    };
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  function toggle() {
    const next = document.documentElement.classList.contains("dark") ? "light" : "dark";
    applyTheme(next);
    localStorage.setItem(STORAGE_KEY, next);
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Toggle color theme"
      className={
        compact
          ? "inline-flex size-10 items-center justify-center rounded-full border border-line text-muted hover:text-ink"
          : "inline-flex min-h-11 items-center rounded-full border border-line px-3 text-sm font-semibold"
      }
    >
      <span className="dark:hidden">{compact ? "◐" : "Dark"}</span>
      <span className="hidden dark:inline">{compact ? "◑" : "Light"}</span>
    </button>
  );
}
