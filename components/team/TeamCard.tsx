"use client";

import { motion } from "framer-motion";
import { Scale } from "lucide-react";
import { useMemo, useState } from "react";
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
  const [failed, setFailed] = useState(member.isPlaceholder || !member.image);
  const initials = useMemo(
    () => getInitials(member.name, member.isPlaceholder),
    [member.isPlaceholder, member.name],
  );
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
        <div className="relative flex h-full items-center justify-center p-6 text-center">
          <div
            className={cn(
              "grid place-items-center rounded-full bg-white font-black text-als-blue shadow-sm ring-1 ring-als-line",
              large ? "h-24 w-24 text-3xl" : "h-20 w-20 text-2xl",
            )}
          >
            {member.isPlaceholder ? (
              <Scale className="h-9 w-9 text-als-red" aria-hidden="true" />
            ) : (
              initials
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export function TeamCard({ member, variant = "default" }: TeamCardProps) {
  const featured = variant === "featured";

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
        <div>
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
      </div>
    </motion.article>
  );
}
