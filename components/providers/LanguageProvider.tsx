"use client";

import {
  createContext,
  useContext,
  useCallback,
  useEffect,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { dictionaries, type Dictionary, type Language } from "@/dictionaries";

type Locale = Language;

type LanguageContextValue = {
  language: Locale;
  locale: Locale;
  dictionary: Dictionary;
  t: Dictionary;
  setLanguage: (language: Locale) => void;
  setLocale: (locale: Locale) => void;
  mounted: boolean;
};

const DEFAULT_LOCALE: Locale = "en";

export const languageOptions: Array<{
  code: Locale;
  label: string;
  nativeLabel: string;
  shortLabel: string;
  flag: string;
}> = [
  {
    code: "az",
    label: "Azerbaijani",
    nativeLabel: "Azərbaycan",
    shortLabel: "AZ",
    flag: "🇦🇿",
  },
  {
    code: "en",
    label: "English",
    nativeLabel: "English",
    shortLabel: "EN",
    flag: "🇬🇧",
  },
  {
    code: "ru",
    label: "Russian",
    nativeLabel: "Русский",
    shortLabel: "RU",
    flag: "🇷🇺",
  },
];

const LanguageContext = createContext<LanguageContextValue | null>(null);

const LOCALE_STORAGE_KEY = "als-locale";
const LEGACY_LANGUAGE_STORAGE_KEY = "als-language";
const LOCALE_CHANGE_EVENT = "als-locale-change";

function isLocale(value: string | null): value is Locale {
  return Boolean(value && value in dictionaries);
}

function getStoredLocale(): Locale {
  if (typeof window === "undefined") return DEFAULT_LOCALE;

  const savedLocale =
    window.localStorage.getItem(LOCALE_STORAGE_KEY) ||
    window.localStorage.getItem(LEGACY_LANGUAGE_STORAGE_KEY);

  return isLocale(savedLocale) ? savedLocale : DEFAULT_LOCALE;
}

function subscribeToLocale(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(LOCALE_CHANGE_EVENT, callback);

  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(LOCALE_CHANGE_EVENT, callback);
  };
}

function subscribeToMount() {
  return () => undefined;
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const locale = useSyncExternalStore(
    subscribeToLocale,
    getStoredLocale,
    () => DEFAULT_LOCALE,
  );
  const mounted = useSyncExternalStore(
    subscribeToMount,
    () => true,
    () => false,
  );

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const setLocale = useCallback((nextLocale: Locale) => {
    window.localStorage.setItem(LOCALE_STORAGE_KEY, nextLocale);
    window.localStorage.setItem(LEGACY_LANGUAGE_STORAGE_KEY, nextLocale);
    document.documentElement.lang = nextLocale;
    window.dispatchEvent(new Event(LOCALE_CHANGE_EVENT));
  }, []);

  const setLanguage = useCallback((nextLanguage: Locale) => {
    setLocale(nextLanguage);
  }, [setLocale]);

  const dictionary = dictionaries[locale] ?? dictionaries[DEFAULT_LOCALE];

  const value = useMemo(
    () => ({
      language: locale,
      locale,
      dictionary,
      t: dictionary,
      setLanguage,
      setLocale,
      mounted,
    }),
    [locale, dictionary, mounted, setLanguage, setLocale],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }

  return context;
}

export function useI18n() {
  return useLanguage();
}
