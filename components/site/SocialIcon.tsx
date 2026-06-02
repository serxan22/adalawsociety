import type { SocialLink } from "@/data/socials";
import { cn } from "@/lib/utils";

type SocialIconProps = {
  name: SocialLink["name"];
  className?: string;
};

export function SocialIcon({ name, className }: SocialIconProps) {
  if (name === "Instagram") {
    return (
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
        className={cn("h-4 w-4", className)}
        fill="none"
      >
        <rect x="5" y="5" width="14" height="14" rx="4" stroke="currentColor" strokeWidth="2" />
        <circle cx="12" cy="12" r="3.2" stroke="currentColor" strokeWidth="2" />
        <circle cx="16.7" cy="7.6" r="1" fill="currentColor" />
      </svg>
    );
  }

  if (name === "Facebook") {
    return (
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
        className={cn("h-4 w-4", className)}
        fill="none"
      >
        <path
          d="M14.5 8.1h2.1V5.2c-.5-.1-1.5-.2-2.7-.2-2.7 0-4.5 1.6-4.5 4.6v2.6H6.7v3.2h2.7V22h3.4v-6.6h2.8l.5-3.2h-3.3V9.9c0-1 .3-1.8 1.7-1.8Z"
          fill="currentColor"
        />
      </svg>
    );
  }

  if (name === "LinkedIn") {
    return (
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
        className={cn("h-4 w-4", className)}
        fill="none"
      >
        <rect x="4" y="4" width="16" height="16" rx="3" stroke="currentColor" strokeWidth="2" />
        <path d="M8.2 10.4V16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <circle cx="8.2" cy="7.9" r="1.1" fill="currentColor" />
        <path
          d="M12 16v-5.6M12 12.9c.5-1.6 3.8-2.2 3.8 1.1v2"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={cn("h-4 w-4", className)}
      fill="none"
    >
      <rect x="3.5" y="6.5" width="17" height="11" rx="3" stroke="currentColor" strokeWidth="2" />
      <path d="m10.5 9.6 4.3 2.4-4.3 2.4V9.6Z" fill="currentColor" />
    </svg>
  );
}
