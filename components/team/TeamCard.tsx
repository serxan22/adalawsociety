"use client";

import { motion } from "framer-motion";
import { Briefcase, Mail, Scale, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useI18n } from "@/components/providers/LanguageProvider";
import type { TeamMember } from "@/data/team";
import { cn } from "@/lib/utils";

type TeamCardProps = {
  member: TeamMember;
  variant?: "featured" | "default";
};

function getInitials(name: string, isPlaceholder: boolean) {
  if (isPlaceholder) return "ALS";

  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

function MemberAvatar({
  member,
  large = false,
}: {
  member: TeamMember;
  large?: boolean;
}) {
  const { t } = useI18n();
  const [failed, setFailed] = useState(member.isPlaceholder || !member.image);
  const initials = useMemo(
    () => getInitials(member.name, member.isPlaceholder),
    [member.isPlaceholder, member.name],
  );
  const groupLabel =
    {
      Board: t.team.board,
      "Event Committee": t.team.eventCommittee,
      "Marketing Committee": t.team.marketingCommittee,
      "Blog Committee": t.team.blogCommittee,
    }[member.group] ?? member.group;
  const showImage = member.image && !failed;

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-als-line bg-[radial-gradient(circle_at_20%_18%,rgba(174,72,94,0.14),transparent_7rem),radial-gradient(circle_at_82%_70%,rgba(63,96,118,0.08),transparent_8rem),linear-gradient(135deg,#ffffff_0%,#f6f8fb_100%)]",
        large ? "min-h-72" : "h-48",
      )}
    >
      <div className="absolute inset-x-0 top-0 h-1 bg-als-red" />
      <div className="absolute inset-0 legal-pattern opacity-[0.14]" />
      {showImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={member.image}
          alt={member.name}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          onError={() => setFailed(true)}
        />
      ) : (
        <div className="relative flex h-full flex-col items-center justify-center gap-4 p-6 text-center">
          <div className="grid h-20 w-20 place-items-center rounded-full bg-white text-2xl font-black text-als-blue shadow-sm ring-1 ring-als-line">
            {member.isPlaceholder ? (
              <Scale className="h-9 w-9 text-als-red" aria-hidden="true" />
            ) : (
              initials
            )}
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-als-red">
              {member.isPlaceholder ? t.team.profilePendingConfirmation : groupLabel}
            </p>
            <p className="mt-2 text-sm font-semibold text-als-blue">{member.role}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export function TeamCard({ member, variant = "default" }: TeamCardProps) {
  const { t } = useI18n();
  const featured = variant === "featured";
  const groupLabel =
    {
      Board: t.team.board,
      "Event Committee": t.team.eventCommittee,
      "Marketing Committee": t.team.marketingCommittee,
      "Blog Committee": t.team.blogCommittee,
    }[member.group] ?? member.group;

  return (
    <motion.article
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 300, damping: 24 }}
      className={cn(
        "group relative overflow-hidden rounded-3xl border border-als-line bg-white shadow-sm transition hover:border-als-red/25 hover:shadow-xl hover:shadow-als-blue/10",
        featured && "grid gap-0 md:grid-cols-[0.85fr_1.15fr]",
      )}
    >
      <div className={cn("p-4", featured && "lg:p-5")}>
        <MemberAvatar member={member} large={featured} />
      </div>

      <div className={cn("flex flex-col p-5 pt-0", featured && "justify-center p-6 lg:p-8")}>
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1 rounded-full border border-als-red/15 bg-als-red/[0.06] px-3 py-1 text-xs font-bold text-als-red">
            <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
            {groupLabel}
          </span>
          {member.isPlaceholder ? (
            <span className="rounded-full border border-dashed border-als-red/25 bg-als-red/[0.04] px-3 py-1 text-xs font-bold text-als-red">
              {t.team.profilePendingConfirmation}
            </span>
          ) : null}
        </div>

        <div className="mt-4">
          <h3
            className={cn(
              "font-black leading-tight text-als-blue",
              featured ? "text-3xl" : "text-xl",
            )}
          >
            {member.name}
          </h3>
          <p className="mt-2 text-sm font-bold text-als-red">{member.role}</p>
        </div>

        <p className="mt-4 text-sm leading-7 text-als-muted">{member.bio}</p>

        {member.focusAreas.length > 0 ? (
          <div className="mt-5 flex flex-wrap gap-2">
            {member.focusAreas.map((area) => (
              <span
                key={area}
                className="rounded-full border border-als-line bg-[#fbfcfe] px-3 py-1 text-xs font-bold text-als-blue"
              >
                {area}
              </span>
            ))}
          </div>
        ) : null}

        {member.linkedin || member.email ? (
          <div className="mt-6 flex items-center gap-2">
            {member.linkedin ? (
              <Link
                href={member.linkedin}
                target="_blank"
                aria-label={`${member.name} LinkedIn`}
                className="grid h-10 w-10 place-items-center rounded-full border border-als-line text-als-blue transition hover:border-als-red hover:bg-als-red/5 hover:text-als-red"
              >
                <Briefcase className="h-4 w-4" aria-hidden="true" />
              </Link>
            ) : null}
            {member.email ? (
              <a
                href={`mailto:${member.email}`}
                aria-label={`Email ${member.name}`}
                className="grid h-10 w-10 place-items-center rounded-full border border-als-line text-als-blue transition hover:border-als-red hover:bg-als-red/5 hover:text-als-red"
              >
                <Mail className="h-4 w-4" aria-hidden="true" />
              </a>
            ) : null}
          </div>
        ) : null}
      </div>
    </motion.article>
  );
}
