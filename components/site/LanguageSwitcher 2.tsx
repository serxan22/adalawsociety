"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronDown, Languages } from "lucide-react";
import { useState } from "react";
import { languageOptions, useI18n } from "@/components/providers/LanguageProvider";
import type { Language } from "@/dictionaries";
import { cn } from "@/lib/utils";

type LanguageSwitcherProps = {
  compact?: boolean;
};

export function LanguageSwitcher({ compact = false }: LanguageSwitcherProps) {
  const { language, setLanguage, t } = useI18n();
  const [open, setOpen] = useState(false);
  const current = languageOptions.find((option) => option.code === language) || languageOptions[1];

  const selectLanguage = (code: Language) => {
    setLanguage(code);
    setOpen(false);
  };

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className={cn(
          "inline-flex h-10 items-center gap-2 rounded-full border border-als-line bg-white px-3 text-sm font-semibold text-als-blue shadow-sm transition hover:border-als-red/40",
          compact && "w-full justify-between rounded-lg",
        )}
      >
        <Languages className="h-4 w-4 text-als-red" aria-hidden="true" />
        <span className="text-base leading-none">{current.flag}</span>
        <span>{compact ? current.nativeLabel : current.code.toUpperCase()}</span>
        <ChevronDown className="h-4 w-4" aria-hidden="true" />
        <span className="sr-only">{t.nav.language}</span>
      </button>

      <AnimatePresence>
        {open ? (
          <motion.div
            role="menu"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.16 }}
            className={cn(
              "absolute right-0 z-50 mt-3 w-52 rounded-lg border border-als-line bg-white p-2 shadow-xl shadow-als-blue/10",
              compact && "left-0 right-auto w-full",
            )}
          >
            {languageOptions.map((option) => (
              <button
                key={option.code}
                type="button"
                role="menuitem"
                onClick={() => selectLanguage(option.code)}
                className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm text-als-blue transition hover:bg-als-red/[0.08]"
              >
                <span className="flex items-center gap-2">
                  <span className="text-lg">{option.flag}</span>
                  <span>
                    <span className="block font-semibold">{option.nativeLabel}</span>
                    <span className="block text-xs text-als-muted">{option.label}</span>
                  </span>
                </span>
                {language === option.code ? (
                  <Check className="h-4 w-4 text-als-red" aria-hidden="true" />
                ) : null}
              </button>
            ))}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
