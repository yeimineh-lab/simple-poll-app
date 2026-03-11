import en from "./en.mjs";
import no from "./no.mjs";

const translations = { en, no };

export function detectLanguage() {
  const lang = navigator.language.toLowerCase();

  if (lang.startsWith("no") || lang.startsWith("nb") || lang.startsWith("nn")) {
    return "no";
  }

  return "en";
}

export function t(key) {
  const lang = detectLanguage();
  return translations[lang]?.[key] ?? key;
}