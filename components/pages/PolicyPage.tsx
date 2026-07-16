"use client";

import { useI18n } from "@/components/providers/LanguageProvider";
import { Reveal } from "@/components/site/Reveal";
import { EditableText } from "@/components/cms/EditableText";

type PolicyPageProps = {
  policyKey: string;
  title: string;
  intro: string;
  sections: Array<{
    heading: string;
    body: string;
  }>;
};

export function PolicyPage({ policyKey, title, intro, sections }: PolicyPageProps) {
  const { t } = useI18n();

  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-br from-[#3F6076] to-[#2F4C60] py-20 text-white">
        <div className="absolute inset-0 hero-grid opacity-[0.14]" aria-hidden="true" />
        <div className="container-wide relative">
          <Reveal>
            <p className="text-sm font-semibold uppercase text-white/75">{t.footer.policies}</p>
            <h1 className="mt-4 text-4xl font-bold leading-tight md:text-6xl">
              <EditableText contentKey={`policy.${policyKey}.title`} fallback={title} tag="span" />
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-white/[0.76]">
              <EditableText contentKey={`policy.${policyKey}.intro`} fallback={intro} tag="span" />
            </p>
          </Reveal>
        </div>
      </section>

      <section className="section-y bg-gradient-to-br from-[#3F6076] to-[#2F4C60]">
        <div className="container-wide">
          <div className="mx-auto max-w-3xl space-y-5">
            {sections.map((section, index) => (
              <Reveal key={section.heading} delay={index * 0.04}>
                <article className="rounded-lg border border-als-line bg-white p-6 shadow-sm">
                  <h2 className="text-2xl font-bold text-als-blue">
                    <EditableText
                      contentKey={`policy.${policyKey}.section.${index}.heading`}
                      fallback={section.heading}
                      tag="span"
                    />
                  </h2>
                  <p className="mt-3 text-base leading-7 text-als-muted">
                    <EditableText
                      contentKey={`policy.${policyKey}.section.${index}.body`}
                      fallback={section.body}
                      tag="span"
                    />
                  </p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
