"use client";

import Link from "next/link";
import { Mail, MapPin } from "lucide-react";
import { useI18n } from "@/components/providers/LanguageProvider";
import { Logo } from "@/components/site/Logo";
import { SocialIcon } from "@/components/site/SocialIcon";
import { EditableText } from "@/components/cms/EditableText";
import { EditableI18nText } from "@/components/cms/EditableI18nText";
import { socials } from "@/data/socials";

export function Footer() {
  const { t } = useI18n();
  const year = new Date().getFullYear();

  const quickLinks = [
    { key: "footer.link.about", label: t.nav.about, href: "/about" },
    { key: "footer.link.news", label: t.nav.news, href: "/news" },
    { key: "footer.link.blog", label: t.nav.blog, href: "/blog" },
    { key: "footer.link.team", label: t.nav.team, href: "/team/2025-2026" },
    { key: "footer.link.competitions", label: t.nav.competitions, href: "/competitions/debate" },
    { key: "footer.link.contact", label: t.nav.contact, href: "/contact" },
  ];

  const policyLinks = [
    { key: "footer.link.blogPolicy", label: "Blog Policy", href: "/blog-policy" },
    { key: "footer.link.privacyPolicy", label: "Privacy Policy", href: "/privacy-policy" },
    { key: "footer.link.terms", label: "Terms", href: "/terms" },
  ];

  return (
    <footer className="border-t border-white/10 bg-gradient-to-br from-[#3F6076] to-[#2F4C60] text-white">
      <div className="container-wide py-14">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr_0.8fr_1fr]">
          <div className="space-y-5">
            <Logo
              markClassName="border-white/15 bg-white"
              textClassName="text-white"
            />
            <p className="text-sm font-semibold text-white/80">
              <EditableText contentKey="footer.tagline" fallback="Your Gateway to the Legal World" tag="span" />
            </p>
            <p className="max-w-md text-sm leading-7 text-white/[0.72]">
              <EditableI18nText contentKey="footer.description" value={t.footer.description} />
            </p>
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
            <h2 className="text-sm font-semibold uppercase text-white/[0.55]">
              <EditableI18nText contentKey="footer.quickLinks" value={t.footer.quickLinks} />
            </h2>
            <div className="mt-4 grid gap-3">
              {quickLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-white/[0.76] transition hover:text-white"
                >
                  <EditableI18nText contentKey={link.key} value={link.label} />
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-sm font-semibold uppercase text-white/[0.55]">
              <EditableI18nText contentKey="footer.policies" value={t.footer.policies} />
            </h2>
            <div className="mt-4 grid gap-3">
              {policyLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-white/[0.76] transition hover:text-white"
                >
                  <EditableText contentKey={link.key} fallback={link.label} tag="span" />
                </Link>
              ))}
            </div>
          </div>

          <div className="space-y-4 text-sm text-white/[0.76]">
            <div className="flex gap-3">
              <Mail className="mt-0.5 h-4 w-4 text-white/70" />
              <a href="mailto:lawsociety@ada.edu.az" className="hover:text-white">
                <EditableText contentKey="footer.email" fallback="lawsociety@ada.edu.az" tag="span" />
              </a>
            </div>
            <div className="flex gap-3">
              <SocialIcon name="Instagram" className="mt-0.5 text-white/70" />
              <a
                href="https://www.instagram.com/adalawsociety/"
                target="_blank"
                className="hover:text-white"
              >
                <EditableText contentKey="footer.instagram" fallback="@adalawsociety" tag="span" />
              </a>
            </div>
            <div className="flex gap-3">
              <MapPin className="mt-0.5 h-4 w-4 text-white/70" />
              <span>
                <EditableText contentKey="footer.location" fallback="ADA University, Baku, Azerbaijan" tag="span" />
              </span>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-white/[0.55] md:flex-row md:items-center md:justify-between">
          <p>
            © {year} ADA Law Society. <EditableI18nText contentKey="footer.copyright" value={t.footer.copyright} />
          </p>
          <p>
            <EditableText contentKey="footer.established" fallback="Established September 2019" tag="span" />
          </p>
        </div>
      </div>
    </footer>
  );
}
