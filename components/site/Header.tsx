"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Menu, X } from "lucide-react";
import { useState } from "react";
import { useI18n } from "@/components/providers/LanguageProvider";
import { LanguageSwitcher } from "@/components/site/LanguageSwitcher";
import { Logo } from "@/components/site/Logo";
import { NavDropdown } from "@/components/site/NavDropdown";
import { cn } from "@/lib/utils";

const teamItems = [
  { labelKey: "teamArchive", href: "/team" },
  { labelKey: "team2023", href: "/team/2023-2024" },
  { labelKey: "team2024", href: "/team/2024-2025" },
  { labelKey: "team2025", href: "/team/2025-2026" },
] as const;

const competitionItems = [
  { labelKey: "debate", href: "/competitions/debate" },
  { labelKey: "mootCourt", href: "/competitions/moot-court" },
] as const;

export function Header() {
  const pathname = usePathname();
  const { t } = useI18n();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openGroup, setOpenGroup] = useState<string | null>(null);

  const navLinks = [
    { label: t.nav.home, href: "/" },
    { label: t.nav.about, href: "/about" },
    { label: t.nav.news, href: "/news" },
    { label: t.nav.blog, href: "/blog" },
  ];

  const translatedTeamItems = teamItems.map((item) => ({
    label: t.nav[item.labelKey],
    href: item.href,
  }));
  const translatedCompetitionItems = competitionItems.map((item) => ({
    label: t.nav[item.labelKey],
    href: item.href,
  }));

  const closeMobile = () => {
    setMobileOpen(false);
    setOpenGroup(null);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-white/15 bg-[linear-gradient(135deg,#3F6076_0%,#2F4C60_100%)] text-white shadow-[0_14px_40px_rgba(47,76,96,0.22)] backdrop-blur-xl">
      <div className="container-wide">
        <div className="flex h-[5.25rem] items-center justify-between gap-4">
          <Logo
            markClassName="h-12 w-12 rounded-xl border-white/25 bg-white shadow-[0_10px_26px_rgba(16,24,40,0.14)]"
            textClassName="text-lg text-white"
          />

          <nav aria-label="Main navigation" className="hidden items-center gap-7 lg:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                aria-current={pathname === link.href ? "page" : undefined}
                className={cn(
                  "nav-underline text-sm font-semibold text-white/86 transition hover:text-white",
                  pathname === link.href && "text-white",
                )}
              >
                {link.label}
              </Link>
            ))}
            <NavDropdown label={t.nav.team} items={translatedTeamItems} />
            <NavDropdown label={t.nav.competitions} items={translatedCompetitionItems} />
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            <LanguageSwitcher />
            <Link
              href="/contact"
              className="inline-flex h-11 items-center justify-center rounded-full border border-white/35 bg-white px-5 text-sm font-bold text-als-blue-dark shadow-[0_12px_30px_rgba(16,24,40,0.16)] transition hover:-translate-y-0.5 hover:border-als-red hover:bg-als-red hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              {t.nav.contactUs}
            </Link>
          </div>

          <button
            type="button"
            aria-label={mobileOpen ? t.nav.close : t.nav.menu}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((value) => !value)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white shadow-sm backdrop-blur transition hover:bg-white/16 lg:hidden"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen ? (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden border-t border-als-line bg-white lg:hidden"
          >
            <div className="container-wide space-y-2 py-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={closeMobile}
                  className={cn(
                    "block rounded-lg px-3 py-3 text-sm font-semibold text-als-blue",
                    pathname === link.href && "bg-als-red/10 text-als-red",
                  )}
                >
                  {link.label}
                </Link>
              ))}
              <MobileAccordion
                label={t.nav.team}
                open={openGroup === "team"}
                onToggle={() => setOpenGroup(openGroup === "team" ? null : "team")}
                items={translatedTeamItems}
                onNavigate={closeMobile}
              />
              <MobileAccordion
                label={t.nav.competitions}
                open={openGroup === "competitions"}
                onToggle={() =>
                  setOpenGroup(openGroup === "competitions" ? null : "competitions")
                }
                items={translatedCompetitionItems}
                onNavigate={closeMobile}
              />
              <div className="px-3 py-3">
                <p className="text-[11px] font-black uppercase tracking-[0.16em] text-als-muted">
                  {t.nav.language}
                </p>
                <div className="mt-3 flex justify-center">
                  <LanguageSwitcher compact onLanguageChange={closeMobile} />
                </div>
              </div>
              <Link
                href="/contact"
                onClick={closeMobile}
                className="mt-3 flex h-12 items-center justify-center rounded-full bg-als-red px-5 text-sm font-semibold text-white"
              >
                {t.nav.contactUs}
              </Link>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}

function MobileAccordion({
  label,
  items,
  open,
  onToggle,
  onNavigate,
}: {
  label: string;
  items: Array<{ label: string; href: string }>;
  open: boolean;
  onToggle: () => void;
  onNavigate: () => void;
}) {
  const pathname = usePathname();

  return (
    <div className="rounded-lg border border-als-line p-2">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between rounded-lg px-3 py-3 text-sm font-semibold text-als-blue"
      >
        <span>{label}</span>
        <ChevronDown className={cn("h-4 w-4 transition", open && "rotate-180")} />
      </button>
      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="grid gap-1 px-2 pb-2"
          >
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={onNavigate}
                className={cn(
                  "rounded-lg px-3 py-2 text-sm font-semibold text-als-blue",
                  pathname === item.href && "bg-als-red/10 text-als-red",
                )}
              >
                {item.label}
              </Link>
            ))}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
