"use client";

import { motion } from "framer-motion";
import { useId } from "react";
import { languageOptions, useI18n } from "@/components/providers/LanguageProvider";
import type { Language } from "@/dictionaries";
import { cn } from "@/lib/utils";

type LanguageSwitcherProps = {
  compact?: boolean;
  onLanguageChange?: () => void;
};

export function LanguageSwitcher({
  compact = false,
  onLanguageChange,
}: LanguageSwitcherProps) {
  const { language, setLanguage, mounted } = useI18n();
  const layoutId = useId();
  const safeLanguage = mounted ? language : "en";

  const selectLanguage = (code: Language) => {
    if (code !== language) {
      setLanguage(code);
    }

    onLanguageChange?.();
  };

  return (
    <div
      role="group"
      aria-label="Choose language"
      className={cn(
        "inline-flex items-center gap-0.5 rounded-full border border-white/25 bg-white/10 p-1 backdrop-blur-xl transition-colors hover:border-white/35",
        compact ? "h-11" : "h-9",
      )}
    >
      {languageOptions.map((option) => {
        const active = option.code === safeLanguage;

        return (
          <button
            key={option.code}
            type="button"
            aria-pressed={active}
            aria-label={`Switch to ${option.label}`}
            title={option.label}
            onClick={() => selectLanguage(option.code)}
            className={cn(
              "relative isolate inline-flex items-center justify-center rounded-full px-2.5 text-[11px] font-black uppercase tracking-[0.08em] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white",
              compact ? "h-9 min-w-[2.75rem]" : "h-7 min-w-[2.25rem]",
              active ? "text-white" : "text-white/60 hover:text-white/90",
            )}
          >
            {active ? (
              <motion.span
                layoutId={`lang-pill-${layoutId}`}
                className="absolute inset-0 -z-10 rounded-full bg-als-red shadow-[0_6px_18px_rgba(174,72,94,0.45)]"
                transition={{ type: "spring", stiffness: 500, damping: 32 }}
              />
            ) : null}
            {option.shortLabel}
          </button>
        );
      })}
    </div>
  );
}
