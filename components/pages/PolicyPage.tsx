"use client";

import { useI18n } from "@/components/providers/LanguageProvider";
import { Reveal } from "@/components/site/Reveal";

type PolicyPageProps = {
  title: string;
  intro: string;
  sections: Array<{
    heading: string;
    body: string;
  }>;
};

export function PolicyPage({ title, intro, sections }: PolicyPageProps) {
  const { t } = useI18n();

  return (
    <>
      <section className="bg-als-blue py-20 text-white">
        <div className="container-wide">
          <Reveal>
            <p className="text-sm font-semibold uppercase text-white/75">{t.footer.policies}</p>
            <h1 className="mt-4 text-4xl font-bold leading-tight md:text-6xl">{title}</h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-white/[0.76]">{intro}</p>
          </Reveal>
        </div>
      </section>

      <section className="section-y bg-white">
        <div className="container-wide">
          <div className="mx-auto max-w-3xl space-y-5">
            {sections.map((section, index) => (
              <Reveal key={section.heading} delay={index * 0.04}>
                <article className="rounded-lg border border-als-line bg-white p-6 shadow-sm">
                  <h2 className="text-2xl font-bold text-als-blue">{section.heading}</h2>
                  <p className="mt-3 text-base leading-7 text-als-muted">{section.body}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
