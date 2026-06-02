import { az } from "./az";
import { en, type Dictionary } from "./en";
import { ru } from "./ru";

export type Language = "en" | "az" | "ru";

export const dictionaries: Record<Language, Dictionary> = {
  en,
  az,
  ru,
};

export type { Dictionary };
