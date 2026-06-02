export type SocialLink = {
  name: "Instagram" | "Facebook" | "LinkedIn" | "YouTube";
  href?: string;
  handle?: string;
  placeholder?: boolean;
};

export const socials: SocialLink[] = [
  { name: "Instagram", href: "https://www.instagram.com/adalawsociety/", handle: "@adalawsociety" },
  { name: "Facebook", placeholder: true },
  { name: "LinkedIn", placeholder: true },
  { name: "YouTube", placeholder: true },
];
