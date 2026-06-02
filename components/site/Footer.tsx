"use client";

import Link from "next/link";
import { Mail, MapPin } from "lucide-react";
import { useI18n } from "@/components/providers/LanguageProvider";
import { Logo } from "@/components/site/Logo";
import { SocialIcon } from "@/components/site/SocialIcon";
import { socials } from "@/data/socials";

export function Footer() {
  const { t } = useI18n();
  const year = new Date().getFullYear();

  const quickLinks = [
    { label: t.nav.about, href: "/about" },
    { label: t.nav.news, href: "/news" },
    { label: t.nav.blog, href: "/blog" },
    { label: t.nav.team, href: "/team/2025-2026" },
    { label: t.nav.competitions, href: "/competitions/debate" },
    { label: t.nav.contact, href: "/contact" },
  ];

  const policyLinks = [
    { label: "Blog Policy", href: "/blog-policy" },
    { label: "Privacy Policy", href: "/privacy-policy" },
    { label: "Terms", href: "/terms" },
  ];

  return (
    <footer className="border-t border-white/10 bg-als-blue text-white">
      <div className="container-wide py-14">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr_0.8fr_1fr]">
          <div className="space-y-5">
            <Logo
              markClassName="border-white/15 bg-white"
              textClassName="text-white"
            />
            <p className="text-sm font-semibold text-white/80">Your Gateway to the Legal World</p>
            <p className="max-w-md text-sm leading-7 text-white/[0.72]">{t.footer.description}</p>
            <div className="flex flex-wrap gap-3">
              {socials.map((social) => {
                return social.href ? (
                  <Link
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    aria-label={`${social.name}${social.handle ? ` ${social.handle}` : ""}`}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/[0.08] text-white transition hover:-translate-y-0.5 hover:border-als-red hover:bg-als-red"
                  >
                    <SocialIcon name={social.name} />
                  </Link>
                ) : (
                  <span
                    key={social.name}
                    aria-label={`${social.name} link pending`}
                    title={`${social.name} link pending`}
                    className="flex h-10 w-10 cursor-default items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-white/55 transition hover:-translate-y-0.5 hover:border-white/25 hover:text-white/80"
                  >
                    <SocialIcon name={social.name} />
                  </span>
                );
              })}
            </div>
          </div>

          <div>
            <h2 className="text-sm font-semibold uppercase text-white/[0.55]">{t.footer.quickLinks}</h2>
            <div className="mt-4 grid gap-3">
              {quickLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-white/[0.76] transition hover:text-white"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-sm font-semibold uppercase text-white/[0.55]">{t.footer.policies}</h2>
            <div className="mt-4 grid gap-3">
              {policyLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-white/[0.76] transition hover:text-white"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="space-y-4 text-sm text-white/[0.76]">
            <div className="flex gap-3">
              <Mail className="mt-0.5 h-4 w-4 text-white/70" />
              <a href="mailto:lawsociety@ada.edu.az" className="hover:text-white">
                lawsociety@ada.edu.az
              </a>
            </div>
            <div className="flex gap-3">
              <SocialIcon name="Instagram" className="mt-0.5 text-white/70" />
              <a
                href="https://www.instagram.com/adalawsociety/"
                target="_blank"
                className="hover:text-white"
              >
                @adalawsociety
              </a>
            </div>
            <div className="flex gap-3">
              <MapPin className="mt-0.5 h-4 w-4 text-white/70" />
              <span>ADA University, Baku, Azerbaijan</span>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-white/[0.55] md:flex-row md:items-center md:justify-between">
          <p>
            © {year} ADA Law Society. {t.footer.copyright}
          </p>
          <p>Established September 2019</p>
        </div>
      </div>
    </footer>
  );
}
