"use client";

import { motion } from "framer-motion";
import { MemberAvatar } from "./MemberAvatar";
import type { TeamMember } from "@/data/team";
import { cn } from "@/lib/utils";

type TeamCardProps = {
  member: TeamMember;
  variant?: "featured" | "default";
};

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
        <MemberAvatar id={member.id} name={member.name} image={member.image} large={featured} />
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
