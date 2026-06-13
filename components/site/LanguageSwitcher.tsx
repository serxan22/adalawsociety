"use client";

import { AnimatePresence, motion, useReducedMotion, type Variants } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { languageOptions, useI18n } from "@/components/providers/LanguageProvider";
import type { Language } from "@/dictionaries";
import { cn } from "@/lib/utils";

type LanguageSwitcherProps = {
  compact?: boolean;
  onLanguageChange?: () => void;
};

const clusterVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.96,
    y: -6,
    transition: { duration: 0.14 },
  },
  show: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.2,
      ease: [0.22, 1, 0.36, 1] as const,
      staggerChildren: 0.04,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.96,
    y: -6,
    transition: {
      duration: 0.14,
      staggerChildren: 0.025,
      staggerDirection: -1,
    },
  },
};

const flagVariants: Variants = {
  hidden: { opacity: 0, scale: 0.9, y: -5 },
  show: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.18, ease: [0.22, 1, 0.36, 1] as const },
  },
  exit: {
    opacity: 0,
    scale: 0.9,
    y: -5,
    transition: { duration: 0.12 },
  },
};

export function LanguageSwitcher({
  compact = false,
  onLanguageChange,
}: LanguageSwitcherProps) {
  const { language, setLanguage, mounted } = useI18n();
  const reduceMotion = useReducedMotion();
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pinnedOpenRef = useRef(false);
  const safeLanguage = mounted ? language : "en";
  const current =
    languageOptions.find((option) => option.code === safeLanguage) || languageOptions[1];

  const clearCloseTimer = useCallback(() => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  }, []);

  const openMenu = useCallback((pinned = false) => {
    clearCloseTimer();
    if (pinned) {
      pinnedOpenRef.current = true;
    }
    setOpen(true);
  }, [clearCloseTimer]);

  const closeMenu = useCallback(() => {
    clearCloseTimer();
    pinnedOpenRef.current = false;
    setOpen(false);
  }, [clearCloseTimer]);

  const scheduleClose = useCallback(() => {
    if (pinnedOpenRef.current) return;

    clearCloseTimer();
    closeTimerRef.current = setTimeout(() => {
      setOpen(false);
      closeTimerRef.current = null;
    }, 150);
  }, [clearCloseTimer]);

  useEffect(() => clearCloseTimer, [clearCloseTimer]);

  useEffect(() => {
    if (!open) return;

    const closeOnOutside = (event: PointerEvent) => {
      if (!wrapperRef.current?.contains(event.target as Node)) {
        closeMenu();
      }
    };

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeMenu();
      }
    };

    document.addEventListener("pointerdown", closeOnOutside);
    document.addEventListener("keydown", closeOnEscape);

    return () => {
      document.removeEventListener("pointerdown", closeOnOutside);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [closeMenu, open]);

  const selectLanguage = (code: Language) => {
    if (code !== language) {
      setLanguage(code);
    }

    closeMenu();
    onLanguageChange?.();
  };

  return (
    <div
      ref={wrapperRef}
      className={cn("relative inline-flex items-center", compact && "justify-center")}
      onPointerEnter={(event) => {
        if (event.pointerType !== "touch") openMenu(false);
      }}
      onPointerLeave={(event) => {
        if (event.pointerType !== "touch") scheduleClose();
      }}
      onFocus={() => openMenu(false)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          closeMenu();
        }
      }}
    >
      <motion.button
        type="button"
        aria-label="Change language"
        aria-haspopup="menu"
        aria-expanded={open}
        whileHover={reduceMotion ? undefined : { scale: 1.03 }}
        whileTap={reduceMotion ? undefined : { scale: 0.97 }}
        onClick={() => {
          if (open && pinnedOpenRef.current) {
            closeMenu();
            return;
          }

          openMenu(true);
        }}
        className={cn(
          "group relative isolate inline-grid place-items-center rounded-full border border-white/35 bg-white/88 leading-none shadow-[0_10px_28px_rgba(16,24,40,0.16)] backdrop-blur-xl transition hover:border-als-red/55 hover:bg-white hover:shadow-[0_12px_34px_rgba(16,24,40,0.22)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white",
          compact ? "h-10 w-10 text-xl" : "h-9 w-9 text-lg",
        )}
      >
        <span
          className={cn(
            "absolute rounded-full border border-als-red/0 transition group-hover:border-als-red/30",
            compact ? "inset-1" : "inset-0.5",
          )}
          aria-hidden="true"
        />
        <span
          className={cn(
            "absolute rounded-full bg-als-red shadow-[0_0_0_3px_rgba(255,255,255,0.9)] transition",
            open ? "right-0.5 top-0.5 h-2 w-2 opacity-100" : "right-1 top-1 h-1.5 w-1.5 opacity-65",
          )}
          aria-hidden="true"
        />
        <span className="relative drop-shadow-sm" aria-hidden="true">
          {current.flag}
        </span>
      </motion.button>

      <AnimatePresence>
        {open ? (
          <motion.div
            role="group"
            aria-label="Choose language"
            variants={clusterVariants}
            initial={reduceMotion ? false : "hidden"}
            animate="show"
            exit="exit"
            onPointerEnter={clearCloseTimer}
            className={cn(
              "absolute top-full z-50 mt-2 flex origin-top-right items-center gap-1 rounded-full border border-white/75 bg-white/88 p-1.5 shadow-[0_18px_45px_rgba(47,76,96,0.16)] backdrop-blur-xl",
              compact ? "left-1/2 -translate-x-1/2" : "right-0",
            )}
          >
            <span
              aria-hidden="true"
              className={cn(
                "absolute -top-3 h-3",
                compact ? "left-0 right-0" : "right-0 w-28",
              )}
            />
            {languageOptions.map((option) => {
              const active = option.code === safeLanguage;

              return (
                <motion.button
                  key={option.code}
                  type="button"
                  aria-label={`Switch to ${option.label}`}
                  aria-pressed={active}
                  variants={flagVariants}
                  onClick={() => selectLanguage(option.code)}
                  title={option.shortLabel}
                  className={cn(
                    "group/flag relative grid h-9 w-9 place-items-center rounded-full border bg-white/90 text-lg shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:border-als-red hover:bg-white hover:ring-2 hover:ring-als-red/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-als-red",
                    active
                      ? "border-als-red ring-2 ring-als-red/20"
                      : "border-als-line text-als-blue",
                  )}
                >
                  {active ? (
                    <span
                      className="absolute right-0.5 top-0.5 h-2 w-2 rounded-full bg-als-red shadow-[0_0_0_2px_rgba(255,255,255,1)]"
                      aria-hidden="true"
                    />
                  ) : null}
                  <span aria-hidden="true">{option.flag}</span>
                  <span className="pointer-events-none absolute -bottom-6 left-1/2 -translate-x-1/2 rounded-full bg-als-blue-dark px-2 py-0.5 text-[10px] font-black text-white opacity-0 shadow-sm transition group-hover/flag:opacity-100">
                    {option.shortLabel}
                  </span>
                </motion.button>
              );
            })}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
