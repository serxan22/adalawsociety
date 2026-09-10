export type SocialName = "Instagram" | "Facebook" | "LinkedIn" | "YouTube";
export type SocialLink = { name: SocialName; href: string; handle?: string };
export const socials: SocialLink[] = [
  { name: "Instagram", href: "https://www.instagram.com/adalawsociety/", handle: "@adalawsociety" },
];
