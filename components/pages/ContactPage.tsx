"use client";

import Link from "next/link";
import { Mail, MapPin, Send } from "lucide-react";
import { FormEvent, useState } from "react";
import { useI18n } from "@/components/providers/LanguageProvider";
import { Reveal, SectionHeading } from "@/components/site/Reveal";
import { SocialIcon } from "@/components/site/SocialIcon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { socials } from "@/data/socials";

export function ContactPage() {
  const { t } = useI18n();
  const [sent, setSent] = useState(false);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSent(true);
    event.currentTarget.reset();
  };

  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-br from-[#3F6076] to-[#2F4C60] py-20 text-white">
        <div className="absolute inset-0 hero-grid opacity-[0.14]" aria-hidden="true" />
        <div className="container-wide relative">
          <SectionHeading
            eyebrow={t.contact.eyebrow}
            title={t.contact.title}
            text={t.contact.intro}
            headingLevel="h1"
            className="[&_h1]:text-white [&_p]:text-white/[0.76]"
          />
        </div>
      </section>

      <section className="section-y bg-gradient-to-br from-[#3F6076] to-[#2F4C60]">
        <div className="container-wide grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <Reveal>
            <div className="space-y-5 rounded-lg border border-als-line bg-white p-6 shadow-sm">
              <div className="flex gap-3">
                <Mail className="mt-1 h-5 w-5 text-als-red" />
                <div>
                  <h2 className="font-bold text-als-blue">Email</h2>
                  <a
                    href="mailto:lawsociety@ada.edu.az"
                    className="text-sm text-als-muted transition hover:text-als-red"
                  >
                    lawsociety@ada.edu.az
                  </a>
                </div>
              </div>
              <div className="flex gap-3">
                <MapPin className="mt-1 h-5 w-5 text-als-red" />
                <div>
                  <h2 className="font-bold text-als-blue">Location</h2>
                  <p className="text-sm text-als-muted">{t.contact.location}</p>
                </div>
              </div>
              <div className="border-t border-als-line pt-5">
                <h2 className="font-bold text-als-blue">Social media</h2>
                <div className="mt-4 flex flex-wrap gap-3">
                  {socials.map((social) => {
                    return social.href ? (
                      <Link
                        key={social.name}
                        href={social.href}
                        target="_blank"
                        className="inline-flex h-10 items-center gap-2 rounded-full border border-als-line px-4 text-sm font-semibold text-als-blue transition hover:-translate-y-0.5 hover:border-als-red hover:bg-als-red/5 hover:text-als-red"
                      >
                        <SocialIcon name={social.name} />
                        {social.handle ?? social.name}
                      </Link>
                    ) : (
                      <span
                        key={social.name}
                        title={`${social.name} link pending`}
                        className="inline-flex h-10 cursor-default items-center gap-2 rounded-full border border-dashed border-als-line px-4 text-sm font-semibold text-als-muted transition hover:-translate-y-0.5 hover:border-als-red/30 hover:text-als-blue"
                      >
                        <SocialIcon name={social.name} />
                        {social.name}
                        <span className="text-xs font-bold text-als-red">Link pending</span>
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <form onSubmit={submit} className="rounded-lg border border-als-line bg-white p-6 shadow-sm">
              <div className="grid gap-4 md:grid-cols-2">
                <label className="space-y-2">
                  <span className="text-sm font-semibold text-als-blue">{t.common.name}</span>
                  <Input name="name" required />
                </label>
                <label className="space-y-2">
                  <span className="text-sm font-semibold text-als-blue">{t.common.email}</span>
                  <Input name="email" type="email" required />
                </label>
              </div>
              <label className="mt-4 block space-y-2">
                <span className="text-sm font-semibold text-als-blue">{t.common.subject}</span>
                <Input name="subject" required />
              </label>
              <label className="mt-4 block space-y-2">
                <span className="text-sm font-semibold text-als-blue">{t.common.message}</span>
                <Textarea name="message" required />
              </label>
              <div className="mt-5 flex flex-wrap items-center gap-4">
                <Button type="submit" className="gap-2">
                  <Send className="h-4 w-4" />
                  {t.contact.send}
                </Button>
                {sent ? (
                  <p className="text-sm font-semibold text-als-red">
                    Your message is ready for a future backend connection.
                  </p>
                ) : null}
              </div>
            </form>
          </Reveal>
        </div>
      </section>
    </>
  );
}
